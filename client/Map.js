import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import mapboxgl from 'mapbox-gl';
import createMapboxClient from '@mapbox/mapbox-sdk/services/geocoding';

import { MAPBOX_ACCESS_TOKEN } from '../config';

import { useQueryParams } from './util';
import { createResponseMarker } from './ResponseMarker';
import DetailsPane from './DetailsPane';
import { createDropoffMarker, createDropoffPopup } from './DropoffMarker';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
const mapboxClient = createMapboxClient({ accessToken: MAPBOX_ACCESS_TOKEN });

const getLngLatForQuery = query => {
    return mapboxClient
        .forwardGeocode({ query: query, countries: ['us'] })
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

const useMapData = () => {
    const [responses, setResponses] = useState(null);
    const [dropoffs, setDropoffs] = useState(null);
    const { access } = useQueryParams();

    useEffect(() => {
        fetch(`/api/mapData?access=${access}`)
            .then(res => res.json())
            .then(({ responses, dropoffs }) => {
                setResponses(responses);
                setDropoffs(dropoffs);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (responses && dropoffs) {
        return {
            responses: groupResponsesByZip(responses),
            dropoffs: dropoffs,
        };
    }

    return null;
};

const addResponseMarkerToMap = (map, { zip, entries, onSelectMarker }) => {
    const markerPromise = new Promise(resolve => {
        getLngLatForQuery(zip).then(lngLat => {
            const marker = new mapboxgl.Marker(
                createResponseMarker({ zip, entries, onSelectMarker })
            )
                .setLngLat(lngLat)
                .addTo(map);
            return resolve(marker);
        });
    });
    return { remove: () => markerPromise.then(marker => marker.remove()) };
};

const addDropoffMarkerToMap = (map, { dropoff }) => {
    const { address } = dropoff;
    const markerPromise = new Promise(resolve => {
        getLngLatForQuery(address).then(lngLat => {
            const popup = new mapboxgl.Popup().setDOMContent(
                createDropoffPopup({ dropoff })
            );
            const marker = new mapboxgl.Marker(createDropoffMarker({ dropoff }))
                .setPopup(popup)
                .setLngLat(lngLat)
                .addTo(map);
            return resolve(marker);
        });
    });
    return { remove: () => markerPromise.then(marker => marker.remove()) };
};

const useMapbox = ({ initialPosition, mapData, onSelectMarker, expanded }) => {
    const [domElement, setDomElement] = useState(null);
    const [map, setMap] = useState(null);
    const markerHandlesRef = useRef([]);

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
        const addMarkersToMap = (map, nextMapData) => {
            const { responses, dropoffs } = nextMapData;
            const { current: responseMarkerHandles } = markerHandlesRef;
            responseMarkerHandles.forEach(handle => handle.remove());
            const nextResponseMarkerHandles = [];

            Object.entries(responses).forEach(([zip, entries]) =>
                nextResponseMarkerHandles.push(
                    addResponseMarkerToMap(map, {
                        zip,
                        entries,
                        onSelectMarker,
                    })
                )
            );

            dropoffs.forEach(dropoff =>
                nextResponseMarkerHandles.push(
                    addDropoffMarkerToMap(map, { dropoff })
                )
            );

            markerHandlesRef.current = nextResponseMarkerHandles;
        };

        if (domElement && mapData) {
            if (!map) {
                const map = setupMap({
                    domElement,
                    initialPosition,
                    onClickBackground: () => onSelectMarker(null),
                });
                addMarkersToMap(map, mapData);
                setMap(map);
            }
        }
    }, [domElement, initialPosition, mapData, onSelectMarker, map]);

    return { setMapRef: setDomElement };
};

const bayAreaPosition = {
    center: [-122, 37.6],
    zoom: 8.0,
};

const Map = props => {
    const { expanded } = props;
    const [openMarker, setOpenMarker] = useState(null);
    const mapData = useMapData();

    const { setMapRef } = useMapbox({
        mapData,
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
