import React from 'react';

import er1 from '../static/images/er-1.png';
import er2 from '../static/images/er-2.png';

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

const HeroCounter = props => {
    const { donations } = props;

    if (!donations) {
        return null;
    }

    return (
        <div className="hero-counter">
            <img src={er1} className="flank-photo" />
            <div className="center">
                <div className="label">Total face shields donated</div>
                <div className="count">{getDonationCount(donations)}</div>
                <div className="label">and counting</div>
            </div>
            <img src={er2} className="flank-photo" />
        </div>
    );
};

export default HeroCounter;
