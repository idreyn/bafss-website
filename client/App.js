import React, { useState } from 'react';
import classNames from 'classnames';

import { useQueryParams } from './util';
import { ResponseMarker } from './ResponseMarker';
import { DonationMarker } from './DonationMarker';
import { useMapData } from './useMapData';
import HeroCounter from './HeroCounter';
import Map from './Map';

const dummyResponseMarker = (
    <ResponseMarker zip="" entries={[]} onSelectMarker={() => {}} />
);

const dummyDonationMarker = (
    <DonationMarker donations={[{ totalDonations: 25 }]} />
);

const App = () => {
    const { expandmap } = useQueryParams();
    const [isMapExpanded, setMapExpanded] = useState(expandmap);
    const mapData = useMapData();

    return (
        <main className={classNames(isMapExpanded && 'map-expanded')}>
            <div className="header">
                <h1>Bay Area Face Shield Supply</h1>
            </div>
            {mapData && <HeroCounter donations={mapData.donations} />}
            <p>
                Health care workers around the Bay Area are low on protective
                equipment as they fight the coronavirus pandemic. We are
                producing and distributing 3D-printed face shields like the ones
                shown here, and we need your help.
            </p>
            <h2>Where help is coming from — this is YOU</h2>
            <div className="map-explainer">
                This map (click to zoom and interact) shows where:
                <ul>
                    <li>
                        {dummyResponseMarker} volunteers are donating their{' '}
                        <span className="labor">labor</span>,{' '}
                        <span className="materials">materials</span>,{' '}
                        <span className="tools">tools</span>, and{' '}
                        <span className="funding">money</span>
                    </li>
                    <li>
                        {dummyDonationMarker} we have provided face shields to
                        hospitals and healthcare workers
                    </li>
                </ul>
            </div>
            <Map
                expanded={isMapExpanded}
                onExpand={setMapExpanded}
                mapData={mapData}
            />
            <h3>Contributing Effort</h3>
            <p>
                The interactive map above shows (by ZIP code) where people have
                signed up to contribute 3d printing resources, materials, and
                labor.
            </p>
            <p>
                <strong>
                    <a href="https://forms.gle/pDxaSF5idGm15di98">
                        PUT YOURSELF ON THE MAP! CLICK HERE TO HELP
                    </a>
                </strong>{' '}
            </p>
            <h3>Contributing Funds</h3>
            <p>
                If you aren't in a position to work on this but would like to
                support our efforts, contributors' time is entirely donated, and
                we're buying all our supplies out of pocket at local and online
                retail outlets, then rush shipping them to providers in need.
                Defraying some of those costs would be enormously helpful!
                <br></br>
                (Your personal information will remain confidential)
            </p>
            <h4>PayPal</h4>
            <form
                action="https://www.paypal.com/cgi-bin/webscr"
                method="post"
                target="_top"
            >
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input
                    type="hidden"
                    name="hosted_button_id"
                    value="RYF9NU6X6BSL4"
                />
                <input
                    type="image"
                    src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                    border="0"
                    name="submit"
                    title="PayPal - The safer, easier way to pay online!"
                    alt="Donate with PayPal button"
                />
                <img
                    alt=""
                    border="0"
                    src="https://www.paypal.com/en_US/i/scr/pixel.gif"
                    width="1"
                    height="1"
                />
            </form>
            <h4>Venmo</h4>
            <p>@Santani-Teng</p>

            <h2>FAQs/About</h2>
            <p>
                <strong>What’s a face shield? Is it like a mask?</strong>
                <br></br>A face shield is not a mask that fits snugly over the
                nose and mouth. It is a clear window that protects the whole
                face from droplets and sprays that can carry infection.
            </p>
            <p>
                <strong>
                    Is a face-shield shortage really a problem here?
                </strong>
                <br></br>
                Yes. Personal protective equipment (PPE) is in short supply, and
                there is no clear resupply chain in place currently.
                <br></br>
                <a href="https://megaphone.link/SFO2957716016">
                    SF Chronicle on equipment shortages
                </a>
                <br></br>
                <a href="khn.org/news/a-view-from-the-frontlines-of-californias-covid-19-battle/">
                    Kaiser Health News: From the front lines of the COVID-19
                    battle
                </a>
            </p>
            <p>
                <strong>Where are these face shields coming from?</strong>
                <br></br>
                They are a 3d-printed design made and downloadable from{' '}
                <a href="https://www.budmen.com">Budmen Industries</a>.
            </p>
            <p>
                <strong>Is anyone else using them?</strong>
                <br></br>
                Yes, the idea was inspired by{' '}
                <a href="https://www.nbcboston.com/news/coronavirus/mgh-desperately-needs-supplies-president-says/2094292/">
                    Massachusetts General Hospital and Partners hospitals in the
                    Boston area putting out a similar call
                </a>{' '}
                with the same design.
            </p>
            <p>
                <strong>Do local hospitals actually want DIY help?</strong>
                <br></br>
                Yes, the medical community has{' '}
                <a
                    href="
                    https://twitter.com/vmcfoundation/status/1240707396147638272"
                >
                    asked for this exact kind of work
                </a>
                .
            </p>
            <p>
                {' '}
                <strong>Who is organizing this?</strong>
                <br></br>
                I’m a{' '}
                <a href="https://www.ski.org/users/santani-teng">
                    scientist in San Francisco
                </a>{' '}
                trying to do my day job and a useful job at the same time.
                <br></br>
                But the helpers on the map -- regular Bay Area people -- are the
                real contributors.
            </p>
            <p>
                <strong>
                    Is this one of those horrifying scams to prey on people's
                    helpful nature? Is it dangerous?
                </strong>
                <br></br>
                No. You can help without donating money or breaking social
                distancing guidelines. We wipe everything down and deliver
                materials with no-contact methods.
            </p>
            <p>
                <strong>If I chip in, what’s the money going toward?</strong>
                <br></br>
                Parts, printing costs, deliveries.
            </p>
        </main>
    );
};

export default App;
