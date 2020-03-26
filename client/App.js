import React, { useState } from 'react';
import classNames from 'classnames';

import Map from './Map';
import { useQueryParams } from './util';

const App = () => {
    const { expandmap } = useQueryParams();
    const [isMapExpanded, setMapExpanded] = useState(expandmap);
    return (
        <main className={classNames(isMapExpanded && 'map-expanded')}>
            <div className="centered-column">
                <div className="header">
                    <h1>Bay Area Face Shield Resupply</h1>
                </div>
            </div>
            <Map expanded={isMapExpanded} onExpand={setMapExpanded} />
        </main>
    );
};

export default App;
