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
            </nav>
        </div>
    );
};

export default Nav;
