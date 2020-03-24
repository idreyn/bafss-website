import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

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
            type: 'fill',
            source: 'zips',
            paint: {
                'fill-outline-color': '#696969',
                'fill-color': {
                    property: 'fill',
                    type: 'identity',
                },
                'fill-opacity': 0.65,
            },
            'source-layer': 'zip5_topo_color-2bf335',
        });
    });

    window.__the_map__ = map;
    return map;
};

const useMapbox = ({ initialPosition }) => {
    const [domElement, setDomElement] = useState(null);

    useEffect(() => {
        if (domElement) {
            const map = setupMap(domElement, initialPosition);
            return () => map.remove();
        }
        return () => {};
    }, [domElement, initialPosition]);

    return { setMapRef: setDomElement };
};

const bayArea = {
    initialPosition: {
        center: [-122, 37.7],
        zoom: 9.25,
    },
};

const Map = () => {
    const { setMapRef } = useMapbox(bayArea);
    return <div className="absolute top right left bottom" ref={setMapRef} />;
};

export default Map;
