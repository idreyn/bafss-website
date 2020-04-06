import { useState, useEffect } from 'react';

import { MAPBOX_ACCESS_TOKEN } from '../config';

export const useMapboxgl = () => {
    const [mapboxgl, setMapboxgl] = useState(null);

    useEffect(() => {
        import(/* webpackChunkName: "mapbox-gl" */ 'mapbox-gl').then(
            ({ default: theMapboxgl }) => {
                theMapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
                setMapboxgl(theMapboxgl);
            }
        );
    }, []);

    return mapboxgl;
};
