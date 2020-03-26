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
                    <h1>Bay Area Face Shield Supply</h1>
                </div>
                <p>
                    Health care workers around the Bay Area are low on protective equipment as they fight the coronavirus pandemic. Help us produce and distribute 3d-printed face shields to keep them safe!
                </p>
                <h2>Where help is coming from</h2>
            </div>
            <Map expanded={isMapExpanded} onExpand={setMapExpanded} />
            <div className="centered-column">
                <h3>Contributing Effort</h3>
                <p>
                    The map above shows (by ZIP code) where people have signed up to contribute 3d printing resources, materials, and labor.
                </p>
                <p>
                    <strong><a href="https://forms.gle/pDxaSF5idGm15di98">CLICK HERE TO HELP</a></strong> (Your personal information will remain anonymous)
                </p>
                <h3>Contributing Funds</h3>
                <p>
                    If you aren't in a position to work on this but would like to support our efforts, contributors' time is entirely donated, and we're buying all our supplies out of pocket at local and online retail outlets. Defraying some of those costs would be enormously helpful!                    
                </p>
                <h4>PayPal</h4>
                <p>  
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_s-xclick" />
                        <input type="hidden" name="hosted_button_id" value="RYF9NU6X6BSL4" />
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                        <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                    </form>
                </p>
                <h4>Venmo</h4>
                <p>
                    @Santani-Teng
                </p>

                <h2>FAQs/About</h2>
                <p><strong>What’s a face shield? Is it like a mask?</strong>
                    <br></br>
                    A face shield is not a mask that fits snugly over the nose and mouth. It is a clear window that protects the whole face from droplets and sprays that can carry infection.
                </p>


            </div>
        </main>
    );
};

export default App;
