import React from 'react';
import ReactDOM from 'react-dom';

const Marker = props => {
    const { zip, entries } = props;
    return <div className="marker">{zip}</div>;
};

export const createMarker = props => {
    const newDiv = document.createElement('div');
    ReactDOM.render(<Marker {...props} />, newDiv);
    return newDiv;
};
