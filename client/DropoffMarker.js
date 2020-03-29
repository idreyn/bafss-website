import React from 'react';
import ReactDOM from 'react-dom';

const pluralize = (n, s) => (n === 1 ? n : `${s}s`);

export const DropoffMarker = props => {
    const {
        dropoff: { totalDonations },
    } = props;
    return (
        <div className="dropoff-marker">
            <div className="caduceus" />
            <div className="total-donations">{totalDonations}</div>
        </div>
    );
};

const DropoffPopup = props => {
    const {
        dropoff: { totalDonations, hospitalName, documentationUrl },
    } = props;
    return (
        <div className="dropoff-popup">
            {totalDonations} {pluralize(totalDonations, 'face shield')}{' '}
            delivered to {hospitalName}.
            {documentationUrl && (
                <>
                    {' '}
                    <a
                        href={documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        (See more)
                    </a>
                </>
            )}
        </div>
    );
};

export const createDropoffMarker = props => {
    const container = document.createElement('div');
    container.style.zIndex = 1;
    ReactDOM.render(<DropoffMarker {...props} />, container);
    return container;
};

export const createDropoffPopup = props => {
    const container = document.createElement('div');
    ReactDOM.render(<DropoffPopup {...props} />, container);
    return container;
};
