import React from 'react';
import ReactDOM from 'react-dom';
import pluralize from 'pluralize';

import './donationMarker.scss';

export const DonationMarker = props => {
    const { donations } = props;
    const grandTotalDonations = donations
        .filter(donation => donation.donationType === 'face shields')
        .reduce((sum, next) => sum + next.totalDonations, 0);
    return (
        <div className="donation-marker-component">
            <div className="caduceus" />
            <div className="total-donations">{grandTotalDonations}</div>
        </div>
    );
};

const DonationPopup = props => {
    const { donations } = props;
    // The locationName should be the same for all locations at this popup, since they are grouped
    // by id. So we just pick the first one arbitrarily.
    const [{ locationName }] = donations;

    const renderDonationRow = (donation, key) => {
        const {
            totalDonations,
            donationType,
            documentationUrl,
            date,
        } = donation;
        const seeMore = documentationUrl && (
            <a
                className="see-more-link"
                target="_blank"
                rel="noopener noreferrer"
                href={documentationUrl}
            >
                (see more)
            </a>
        );
        return (
            <li key={key}>
                {totalDonations} {pluralize(donationType, totalDonations)}{' '}
                provided on {date} {seeMore}
            </li>
        );
    };

    return (
        <div className="donation-popup-component">
            <div className="location-name">{locationName}</div>
            <ul>
                {donations.map((donation, index) =>
                    renderDonationRow(donation, index)
                )}
            </ul>
        </div>
    );
};

export const createDonationMarker = props => {
    const container = document.createElement('div');
    container.style.zIndex = 1;
    ReactDOM.render(<DonationMarker {...props} />, container);
    return container;
};

export const createDonationPopup = props => {
    const container = document.createElement('div');
    ReactDOM.render(<DonationPopup {...props} />, container);
    return container;
};
