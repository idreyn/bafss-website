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
                <h2>Overview</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla tellus purus, lobortis ac nunc euismod, finibus
                    euismod nibh. Nullam nec molestie mi, at rhoncus leo. Mauris
                    tempus, nunc quis dapibus ullamcorper, ex dolor pellentesque
                    massa, id blandit ex enim eget tortor. Donec finibus urna
                    finibus velit pellentesque fringilla. Duis consequat dapibus
                    suscipit. Vestibulum ornare nisl eget felis pulvinar, eget
                    condimentum arcu dignissim. Maecenas cursus tortor vitae
                    diam iaculis egestas. Aliquam rhoncus iaculis ultrices.
                </p>
                <p>
                    Nulla facilisi. Praesent a imperdiet dolor, vitae
                    consectetur ipsum. Interdum et malesuada fames ac ante ipsum
                    primis in faucibus. Integer venenatis massa et pretium
                    elementum. Mauris sed convallis lorem, quis vulputate
                    turpis. Quisque metus risus, ultrices ut erat sed, suscipit
                    sodales purus. Nam vitae velit dapibus, convallis sapien
                    vitae, consequat felis. Sed varius finibus velit, id maximus
                    ex rutrum sodales. Integer tristique accumsan orci, sed
                    molestie lectus efficitur a. Interdum et malesuada fames ac
                    ante ipsum primis in faucibus. Aenean gravida nulla in
                    elementum facilisis. Mauris sit amet justo ut est euismod
                    pellentesque at eget justo.
                </p>
                <h2>Where help is coming from</h2>
            </div>
            <Map expanded={isMapExpanded} onExpand={setMapExpanded} />
            <div className="centered-column">
                <h2>More stuff</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nulla tellus purus, lobortis ac nunc euismod, finibus
                    euismod nibh. Nullam nec molestie mi, at rhoncus leo. Mauris
                    tempus, nunc quis dapibus ullamcorper, ex dolor pellentesque
                    massa, id blandit ex enim eget tortor. Donec finibus urna
                    finibus velit pellentesque fringilla. Duis consequat dapibus
                    suscipit. Vestibulum ornare nisl eget felis pulvinar, eget
                    condimentum arcu dignissim. Maecenas cursus tortor vitae
                    diam iaculis egestas. Aliquam rhoncus iaculis ultrices.
                </p>
                <p>
                    Nulla facilisi. Praesent a imperdiet dolor, vitae
                    consectetur ipsum. Interdum et malesuada fames ac ante ipsum
                    primis in faucibus. Integer venenatis massa et pretium
                    elementum. Mauris sed convallis lorem, quis vulputate
                    turpis. Quisque metus risus, ultrices ut erat sed, suscipit
                    sodales purus. Nam vitae velit dapibus, convallis sapien
                    vitae, consequat felis. Sed varius finibus velit, id maximus
                    ex rutrum sodales. Integer tristique accumsan orci, sed
                    molestie lectus efficitur a. Interdum et malesuada fames ac
                    ante ipsum primis in faucibus. Aenean gravida nulla in
                    elementum facilisis. Mauris sit amet justo ut est euismod
                    pellentesque at eget justo.
                </p>
            </div>
        </main>
    );
};

export default App;
