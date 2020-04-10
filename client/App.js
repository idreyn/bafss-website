import React from 'react';
import { Provider as RKProvider } from 'reakit/Provider';
import * as boostrapSystem from 'reakit-system-bootstrap';

import { useColumnEqualizer } from './util';
import { ResponseMarker } from './ResponseMarker';
import { DonationMarker } from './DonationMarker';
import Map from './Map';
import EventStream from './EventStream';

import './app.scss';

const dummyResponseMarker = (
    <ResponseMarker zip="" entries={[]} onSelectMarker={() => {}} />
);

const dummyDonationMarker = (
    <DonationMarker donations={[{ totalDonations: 25 }]} />
);

const getDonationCount = donations => {
    let count = 0;
    Object.values(donations).forEach(donationsAtLocations => {
        donationsAtLocations.forEach(donation => {
            if (donation.donationType === 'face shields') {
                count += donation.totalDonations;
            }
        });
    });
    return count;
};

const App = ({ expandMap = false, pageData = {} }) => {
    const { leaderColumnRef, followerColumnRef } = useColumnEqualizer();
    const { responses, donations } = pageData;

    const renderHeader = () => {
        return (
            <header>
                <div className="header-and-counter">
                    <h1>Bay Area Face Shield Supply</h1>
                    {renderCountBubble()}
                </div>
            </header>
        );
    };

    const renderCountBubble = () => {
        return (
            <div className="count-bubble">
                <div className="background" />
                <div className="count">
                    {pageData ? getDonationCount(pageData.donations) : '...'}
                </div>
                <div className="tag">shields donated</div>
            </div>
        );
    };

    const renderHero = () => {
        return (
            <div className="hero">
                <div className="hero-pair">
                    <div className="photo-bubbles">
                        <img src="images/header-thumb-1.png" />
                    </div>
                    <p>
                        Health care workers around the Bay Area are low on
                        protective equipment as they fight the coronavirus
                        pandemic. We are producing and distributing 3D-printed
                        face shields, and we need your help.
                    </p>
                </div>
                <div className="hero-pair row-reverse">
                    <div className="photo-bubbles">
                        <img src="images/header-thumb-2.png" />
                    </div>
                    <p>
                        Face shields are invaluable equipment for doctors,
                        nurses, EMTs, and pharmacists, because they help prevent
                        transmission of the novel coronavirus through bodily
                        fluids. They complement, rather than replace, equipment
                        like N95 respirators.
                    </p>
                </div>
                <div className="call-to-action">
                    <div className="ask">
                        Want to help print or assemble shields? Can you
                        contribute a few dollars towards our effort?
                    </div>
                    <div className="cta-links">
                        <div className="cta">
                            <a
                                className="cta-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://forms.gle/pDxaSF5idGm15di98"
                            >
                                Volunteer to help&nbsp;&rsaquo;
                            </a>
                        </div>
                        <div className="cta">
                            <a
                                className="cta-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.paypal.me/bayareafaceshields"
                            >
                                Donate via Paypal&nbsp;&rsaquo;
                            </a>
                            <div className="secondary-contribution-info">
                                or Venmo @Santani-Teng
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <RKProvider unstable_system={boostrapSystem}>
            <main>
                {renderHeader()}
                {renderHero()}
                <div className="two-column">
                    <div className="left-column" ref={leaderColumnRef}>
                        <h2>Activity map</h2>
                        <div className="map-explainer">
                            This map (click to zoom and interact) shows where:
                            <ul>
                                <li>
                                    {dummyResponseMarker}{' '}
                                    <span>
                                        volunteers are donating their{' '}
                                        <span className="labor">labor</span>,{' '}
                                        <span className="materials">
                                            materials
                                        </span>
                                        , <span className="tools">tools</span>,
                                        and{' '}
                                        <span className="funding">money</span>
                                    </span>
                                </li>
                                <li>
                                    {dummyDonationMarker}{' '}
                                    <span>
                                        we've donated face shields or other PPE to healthcare
                                        workers
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <Map
                            expanded={expandMap}
                            mapData={{ responses, donations }}
                        />
                        <h2>FAQ</h2>
                        <p>
                            <strong>
                                What’s a face shield? Is it like a mask?
                            </strong>
                            <br></br>A face shield is not a mask that fits
                            snugly over the nose and mouth. It is a clear window
                            that protects the whole face from droplets and
                            sprays that can carry infection.
                        </p>
                        <p>
                            <strong>
                                Is a face-shield shortage really a problem here?
                            </strong>
                            <br></br>
                            Yes. Personal protective equipment (PPE) is in short
                            supply, and there is no clear resupply chain currently in
                            place.
                            <br></br>
                            <a href="https://megaphone.link/SFO2957716016">
                                SF Chronicle podcast on equipment shortages
                            </a>
                            <br></br>
                            <a href="khn.org/news/a-view-from-the-frontlines-of-californias-covid-19-battle/">
                                Kaiser Health News: From the front lines of the
                                COVID-19 battle
                            </a>
                            <br></br>
                            Text from an ER physician colleague describing the shortage:
                            <br></br>
                            <img src="images/20200321_YC_texts.png"></img>
                        </p>
                        <p>
                            <strong>
                                Where are these face shields coming from?
                            </strong>
                            <br></br>
                            They are a 3d-printed design made and downloadable
                            from{' '}
                            <a href="https://www.budmen.com">
                                Budmen Industries
                            </a>
                            . The design has been approved for use in a clinical setting by the National Institutes of Health.
                        </p>
                        <p>
                            <strong>Is anyone else using them?</strong>
                            <br></br>
                            Yes, the idea was inspired by{' '}
                            <a href="https://www.nbcboston.com/news/coronavirus/mgh-desperately-needs-supplies-president-says/2094292/">
                                Massachusetts General Hospital and Partners
                                hospitals in the Boston area putting out a
                                similar call
                            </a>{' '}
                            with the same design.
                            <br></br>
                            Other maker groups are producing this and similar designs; it is among the models featured in the 
                            <a href="https://emergencydesigncollective.com/field-notes/ppe-playbook">
                                Emergency Design Collective's PPE Playbook
                            </a>
                            .
                        </p>
                        <p>
                            <strong>
                                Do local hospitals actually want DIY help?
                            </strong>
                            <br></br>
                            Yes, the medical community has{' '}
                            <a
                                href="
                    https://twitter.com/vmcfoundation/status/1240707396147638272"
                            >
                                asked for this exact kind of work
                            </a>
                            . Our recipients have been extremely grateful and clear about the need for a stopgap measure before the normal supply chain is restored.
                        </p>
                        <p>
                            {' '}
                            <strong>Who is organizing this?</strong>
                            <br></br>
                            I’m a{' '}
                            <a href="https://www.ski.org/users/santani-teng">
                                scientist in San Francisco
                            </a>{' '}
                            trying to do my day job and a useful job at the same
                            time.
                            <br></br>
                            But the helpers on the map &mdash; regular Bay Area (and elsewhere)
                            people &mdash; are the real contributors. BAFSS comprises dozens of people volunteering time and resources in this group effort: 3d-printing visors, cutting and shaping plastic sheets, assembling components, making deliveries, and fueling the process with donations. 
                        </p>
                        <p>
                            <strong>
                                Is this one of those horrifying scams to prey on
                                people's helpful nature? Is it dangerous?
                            </strong>
                            <br></br>
                            No. You can help without donating money or breaking
                            social distancing guidelines. We wipe everything
                            down and deliver materials with no-contact methods.
                        </p>
                        <p>
                            <strong>
                                If I chip in, what’s the money going toward?
                            </strong>
                            <br></br>
                            Parts, printing costs, deliveries, shipping.
                        </p>
                    </div>
                    <div className="right-column" ref={followerColumnRef}>
                        <h2>Latest news</h2>
                        <EventStream events={pageData && pageData.events} />
                    </div>
                </div>
            </main>
        </RKProvider>
    );
};

export default App;
