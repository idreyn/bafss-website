import React, { useState } from 'react';
import classNames from 'classnames';

import { useMap } from './useMap';
import DetailsPane from './DetailsPane';

import './map.scss';

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
            center: [-96.5, 39.5],
            zoom: 2.7,
        },
    },
];

const Map = props => {
    const { expanded, mapData } = props;
    const [openMarker, setOpenMarker] = useState(null);
    const [currentScope, setCurrentScope] = useState(mapScopes[0]);

    const { setMapRef } = useMap({
        mapData,
        expanded,
        scope: currentScope,
        onSelectMarker: setOpenMarker,
    });

    return (
        <div className={classNames('map-component', expanded && 'expanded')}>
            <div className="scope-selector">
                {mapScopes.map(scope => (
                    <div
                        role="button"
                        tabIndex="0"
                        className={classNames(
                            'scope',
                            currentScope === scope && 'active'
                        )}
                        key={scope.key}
                        onClick={() => setCurrentScope(scope)}
                    >
                        {scope.label}
                    </div>
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
