import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import createMapboxClient from '@mapbox/mapbox-sdk/services/geocoding';

import { MAPBOX_ACCESS_TOKEN } from '../config';
import { createMarker } from './Marker';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
const mapboxClient = createMapboxClient({ accessToken: MAPBOX_ACCESS_TOKEN });

const getLngLatForZip = zip => {
    return mapboxClient
        .forwardGeocode({ query: zip })
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

const addMarkerToMap = (map, zip, entries) => {
    console.log('adding to map', zip, entries);
    const popup = new mapboxgl.Popup().setHTML('<div>Hi</div>');
    const markerPromise = new Promise(resolve => {
        getLngLatForZip(zip).then(lngLat => {
            const marker = new mapboxgl.Marker(createMarker({ zip, entries }))
                .setLngLat(lngLat)
                .setPopup(popup)
                .addTo(map);
            return resolve(marker);
        });
    });
    return { remove: () => markerPromise.then(marker => marker.remove()) };
};

const groupResponsesByZip = responses => {
    const res = {};
    responses.forEach(response => {
        const { zip } = response;
        if (!res[zip]) {
            res[zip] = [];
        }
        res[zip].push(res);
    });
    return res;
};

const setupMap = (domElement, initialPosition) => {
    const { center, zoom } = initialPosition;

    const map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v10',
        container: domElement,
        center: center,
        zoom: zoom,
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

    window.__the_map__ = map;
    return map;
};

const useResponses = () => {
    const [responses, setResponses] = useState(null);

    useEffect(() => {
        fetch('/api/responses')
            .then(res => res.json())
            .then(({ responses }) => setResponses(responses));
    }, []);

    return responses && groupResponsesByZip(responses);
};

const useMapbox = ({ initialPosition }, responses) => {
    const [domElement, setDomElement] = useState(null);
    const mapRef = useRef(null);
    const responseMarkerHandlesRef = useRef([]);

    const addResponsesToMap = (map, nextResponses) => {
        const { current: responseMarkerHandles } = responseMarkerHandlesRef;
        responseMarkerHandles.forEach(handle => handle.remove());
        const nextResponseMarkerHandles = [];
        Object.entries(nextResponses).forEach(([zip, entries]) =>
            nextResponseMarkerHandles.push(addMarkerToMap(map, zip, entries))
        );
        responseMarkerHandlesRef.current = nextResponseMarkerHandles;
    };

    useEffect(() => {
        if (domElement && responses) {
            if (!mapRef.current) {
                const map = setupMap(domElement, initialPosition);
                mapRef.current = map;
                console.log('setup');
            }
            addResponsesToMap(mapRef.current, responses);
            return () => mapRef.current.remove();
        }
        return () => {};
    }, [domElement, initialPosition, responses]);

    return { setMapRef: setDomElement };
};

const bayArea = {
    initialPosition: {
        center: [-122, 37.7],
        zoom: 9.25,
    },
};

const Map = () => {
    const responses = useResponses();
    const { setMapRef } = useMapbox(bayArea, responses);

    console.log(responses);

    return <div className="absolute top right left bottom" ref={setMapRef} />;
};

export default Map;
