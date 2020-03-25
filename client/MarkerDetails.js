import React from 'react';

const MarkerDetails = props => {
    const {
        marker: { zip, entries },
    } = props;
    return (
        <div className="marker-details">
            <h1>{zip}</h1>
            Blah blah blah
        </div>
    );
};

export default MarkerDetails;
