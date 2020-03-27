import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import mapboxgl from 'mapbox-gl';
import createMapboxClient from '@mapbox/mapbox-sdk/services/geocoding';

import { MAPBOX_ACCESS_TOKEN } from '../config';

import { useQueryParams } from './util';
import { createMarker } from './Marker';
import DetailsPane from './DetailsPane';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
const mapboxClient = createMapboxClient({ accessToken: MAPBOX_ACCESS_TOKEN });

const getLngLatForZip = zip => {
    return mapboxClient
        .forwardGeocode({ query: zip, countries: ['us'] })
        .send()
        .then(res => {
            if (
                res &&
                res.body &&
                res.body.features &&
                res.body.features.length > 0
            ) {
                const [feature] = res.body.features;
                return feature.center;
            }
        });
};

const groupResponsesByZip = responses => {
    const res = {};
    responses.forEach(response => {
        const { zip } = response;
        if (!res[zip]) {
            res[zip] = [];
        }
        res[zip].push(response);
    });
    return res;
};

const setupMap = ({ domElement, initialPosition, onClickBackground }) => {
    const { center, zoom } = initialPosition;

    const map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v10',
        container: domElement,
        center: center,
        zoom: zoom,
    });

    map.on('click', evt => {
        const {
            originalEvent: { target },
        } = evt;
        // TODO(ian): ahhhhhh!
        if (target.tagName && target.tagName.toLowerCase() === 'canvas') {
            onClickBackground();
        }
    });

    map.on('load', () => {
        map.addSource('zips', {
            type: 'vector',
            url: 'mapbox://jn1532.2z2q31r2',
        });
        map.addLayer({
            id: 'zip',
            type: 'line',
            source: 'zips',
            paint: {
                'line-color': '#696969',
                'line-opacity': 0.2,
                'line-width': 2,
            },
            'source-layer': 'zip5_topo_color-2bf335',
        });
    });
    return map;
};

const useResponses = () => {
    const [responses, setResponses] = useState(null);
    const { access } = useQueryParams();

    useEffect(() => {
        fetch(`/api/responses?access=${access}`)
            .then(res => res.json())
            .then(({ responses }) => setResponses(responses));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return responses && groupResponsesByZip(responses);
};

const addMarkerToMap = (map, { zip, entries, onSelectMarker }) => {
    const markerPromise = new Promise(resolve => {
        getLngLatForZip(zip).then(lngLat => {
            const marker = new mapboxgl.Marker(
                createMarker({ zip, entries, onSelectMarker })
            )
                .setLngLat(lngLat)
                .addTo(map);
            return resolve(marker);
        });
    });
    return { remove: () => markerPromise.then(marker => marker.remove()) };
};

const useMapbox = ({
    initialPosition,
    responses,
    onSelectMarker,
    expanded,
}) => {
    const [domElement, setDomElement] = useState(null);
    const [map, setMap] = useState(null);
    const responseMarkerHandlesRef = useRef([]);

    useEffect(() => {
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [map]);

    useEffect(() => {
        if (map) {
            const enableZoom = () => map.scrollZoom.enable();
            const disableZoom = () => map.scrollZoom.disable();
            if (expanded) {
                enableZoom();
            } else {
                disableZoom();
                const target = map.getCanvas();
                target.addEventListener('focus', enableZoom);
                target.addEventListener('blur', disableZoom);
                return () => {
                    target.removeEventListener('focus', enableZoom);
                    target.removeEventListener('blur', disableZoom);
                };
            }
        }
        return () => {};
    }, [map, expanded]);

    useEffect(() => {
        const addResponsesToMap = (map, nextResponses) => {
            const { current: responseMarkerHandles } = responseMarkerHandlesRef;
            responseMarkerHandles.forEach(handle => handle.remove());
            const nextResponseMarkerHandles = [];
            Object.entries(nextResponses).forEach(([zip, entries]) =>
                nextResponseMarkerHandles.push(
                    addMarkerToMap(map, { zip, entries, onSelectMarker })
                )
            );
            responseMarkerHandlesRef.current = nextResponseMarkerHandles;
        };

        if (domElement && responses) {
            if (!map) {
                const map = setupMap({
                    domElement,
                    initialPosition,
                    onClickBackground: () => onSelectMarker(null),
                });
                addResponsesToMap(map, responses);
                setMap(map);
            }
        }
    }, [domElement, initialPosition, responses, onSelectMarker, map]);

    return { setMapRef: setDomElement };
};

const bayAreaPosition = {
    center: [-122, 37.6],
    zoom: 8.5,
};

const Map = props => {
    const { expanded } = props;
    const [openMarker, setOpenMarker] = useState(null);
    const responses = useResponses();

    const { setMapRef } = useMapbox({
        responses,
        expanded,
        initialPosition: bayAreaPosition,
        onSelectMarker: setOpenMarker,
    });

    return (
        <div className={classNames('map', expanded && 'expanded')}>
            {openMarker && (
                <DetailsPane
                    marker={openMarker}
                    onClose={() => setOpenMarker(null)}
                />
            )}
            <div className="mapbox-container" ref={setMapRef} />
        </div>
    );
};

export default Map;
