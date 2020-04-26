import React, { useEffect } from 'react';
import stickybits from 'stickybits';

import './nav.scss';

const Nav = () => {
    useEffect(() => {
        stickybits('.nav-component', {
            useStickyClasses: true,
        });
    }, []);

    return (
        <div className="nav-component">
            <nav>
                <a href="#home">Home</a>
                <a href="#finances">Finances</a>
                <a href="#map">Map</a>
                <a href="#faq">FAQ</a>
                <a href="#news">News</a>
                <a href="#team">Team</a>
            </nav>
        </div>
    );
};

export default Nav;
