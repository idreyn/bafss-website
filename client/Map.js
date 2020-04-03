import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import mapboxgl from 'mapbox-gl';
import createMapboxClient from '@mapbox/mapbox-sdk/services/geocoding';

import { MAPBOX_ACCESS_TOKEN } from '../config';

import { useQueryParams } from './util';
import { createResponseMarker } from './ResponseMarker';
import DetailsPane from './DetailsPane';
import { createDonationMarker, createDonationPopup } from './DonationMarker';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
const mapboxClient = createMapboxClient({ accessToken: MAPBOX_ACCESS_TOKEN });

const groupItemsByField = (items, fieldName) => {
    const res = {};
    items.forEach(item => {
        const itemValueAtField = item[fieldName];
        if (!res[itemValueAtField]) {
            res[itemValueAtField] = [];
        }
        res[itemValueAtField].push(item);
    });
    return res;
};

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
    const [donations, setdonations] = useState(null);
    const { access } = useQueryParams();

    useEffect(() => {
        fetch(`/api/mapData?access=${access}`)
            .then(res => res.json())
            .then(({ responses, donations }) => {
                setResponses(responses);
                setdonations(donations);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (responses && donations) {
        return {
            responses: groupItemsByField(responses, 'zip'),
            donations: groupItemsByField(donations, 'locationName'),
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

const addDonationMarkerToMap = (map, { donations }) => {
    // Foolishly assume the address will be the same for all elements with the same locationName
    const [firstDonation] = donations;
    const markerPromise = new Promise(resolve => {
        getLngLatForQuery(firstDonation.address).then(lngLat => {
            const popup = new mapboxgl.Popup().setDOMContent(
                createDonationPopup({ donations })
            );
            const marker = new mapboxgl.Marker(
                createDonationMarker({ donations })
            )
                .setPopup(popup)
                .setLngLat(lngLat)
                .addTo(map);
            return resolve(marker);
        });
    });
    return { remove: () => markerPromise.then(marker => marker.remove()) };
};

const useMapbox = ({ scope, mapData, onSelectMarker, expanded }) => {
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
        if (map) {
            const { center, zoom } = scope.position;
            map.setZoom(zoom);
            map.setCenter(center);
        }
    }, [map, scope]);

    useEffect(() => {
        const addMarkersToMap = (map, nextMapData) => {
            const { responses, donations } = nextMapData;
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

            Object.values(donations).forEach(donationsToLocation =>
                nextResponseMarkerHandles.push(
                    addDonationMarkerToMap(map, {
                        donations: donationsToLocation,
                    })
                )
            );

            markerHandlesRef.current = nextResponseMarkerHandles;
        };

        if (domElement && mapData) {
            if (!map) {
                const map = setupMap({
                    domElement,
                    initialPosition: scope.position,
                    onClickBackground: () => onSelectMarker(null),
                });
                addMarkersToMap(map, mapData);
                setMap(map);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [domElement, mapData, onSelectMarker, map]);

    return { setMapRef: setDomElement };
};

const mapScopes = [
    {
        key: 'bay-area',
        label: 'Bay Area',
        position: {
            center: [-122, 37.6],
            zoom: 8.0,
        },
    },
    {
        key: 'continental-us',
        label: 'Continental US',
        position: {
            center: [-98.35, 39.5],
            zoom: 3.5,
        },
    },
];

const Map = props => {
    const { expanded } = props;
    const [openMarker, setOpenMarker] = useState(null);
    const [currentScope, setCurrentScope] = useState(mapScopes[0]);
    const mapData = useMapData();

    const { setMapRef } = useMapbox({
        mapData,
        expanded,
        scope: currentScope,
        onSelectMarker: setOpenMarker,
    });

    return (
        <div className={classNames('map', expanded && 'expanded')}>
            <div className="scope-selector">
                <span className="label">Select scope:</span>
                {mapScopes.map(scope => (
                    <button
                        key={scope.key}
                        type="button"
                        className={classNames(
                            'scope',
                            currentScope === scope && 'active'
                        )}
                        onClick={() => setCurrentScope(scope)}
                    >
                        {scope.label}
                    </button>
                ))}
            </div>
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
