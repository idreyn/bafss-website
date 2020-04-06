import { useState, useEffect, useRef } from 'react';
import createMapboxClient from '@mapbox/mapbox-sdk/services/geocoding';

import { MAPBOX_ACCESS_TOKEN } from '../config';

import { useMapboxgl } from './useMapboxgl';
import { createResponseMarker } from './ResponseMarker';
import { createDonationMarker, createDonationPopup } from './DonationMarker';

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

const setupMap = ({
    mapboxgl,
    domElement,
    initialPosition,
    onClickBackground,
}) => {
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

const addResponseMarkerToMap = (
    mapboxgl,
    map,
    { zip, entries, onSelectMarker }
) => {
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

const addDonationMarkerToMap = (mapboxgl, map, { donations }) => {
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

export const useMap = ({ scope, mapData, onSelectMarker, expanded }) => {
    const mapboxgl = useMapboxgl();
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
        if (!mapboxgl) {
            return;
        }

        const addMarkersToMap = (map, nextMapData) => {
            const { responses, donations } = nextMapData;
            const { current: responseMarkerHandles } = markerHandlesRef;
            responseMarkerHandles.forEach(handle => handle.remove());
            const nextResponseMarkerHandles = [];

            Object.entries(responses).forEach(([zip, entries]) =>
                nextResponseMarkerHandles.push(
                    addResponseMarkerToMap(mapboxgl, map, {
                        zip,
                        entries,
                        onSelectMarker,
                    })
                )
            );

            Object.values(donations).forEach(donationsToLocation =>
                nextResponseMarkerHandles.push(
                    addDonationMarkerToMap(mapboxgl, map, {
                        donations: donationsToLocation,
                    })
                )
            );

            markerHandlesRef.current = nextResponseMarkerHandles;
        };

        if (domElement && mapData) {
            if (!map) {
                const map = setupMap({
                    mapboxgl,
                    domElement,
                    initialPosition: scope.position,
                    onClickBackground: () => onSelectMarker(null),
                });
                addMarkersToMap(map, mapData);
                setMap(map);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [domElement, mapData, onSelectMarker, map, mapboxgl]);

    return { setMapRef: setDomElement };
};
