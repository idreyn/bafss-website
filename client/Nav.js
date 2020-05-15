import React, { useEffect } from 'react';
import stickybits from 'stickybits';

import './nav.scss';

const Nav = () => {
    useEffect(() => {
        const sticky = stickybits('.nav-component', {
            useStickyClasses: true,
        });
        setInterval(() => sticky.update(), 1000);
        return () => sticky.cleanup();
    }, []);

    return (
        <div className="nav-component">
            <nav>
                <div className="links">
                    <a href="#home">Home</a>
                    <a href="#map">Map</a>
                    <a id="finances-link" href="#finances">
                        Finances
                    </a>
                    <a href="#faq">FAQ</a>
                    <a id="news-link" href="#news">
                        News
                    </a>
                    <a href="#team">Team</a>
                </div>
                <div className="social-links">
                    <a
                        href="https://facebook.com/bafss2020"
                        aria-label="BAFSS on Facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="assets/facebook.svg" />
                    </a>
                    <a
                        href="https://instagram.com/bafss2020"
                        aria-label="BAFSS on Instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="assets/instagram.svg" />
                    </a>
                </div>
            </nav>
        </div>
    );
};

export default Nav;
