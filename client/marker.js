import React from 'react';
import ReactDOM from 'react-dom';

// keep this in sync with CSS
const markerRadius = 23;

const polarToCartesian = (centerX, centerY, radius, thetaDeg) => {
    var thetaRad = (thetaDeg * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(thetaRad),
        y: centerY + radius * Math.sin(thetaRad),
    };
};

const describeArc = (x, y, radius, startThetaDeg, endThetaDeg) => {
    var start = polarToCartesian(x, y, radius, endThetaDeg);
    var end = polarToCartesian(x, y, radius, startThetaDeg);
    var largeArcFlag = endThetaDeg - startThetaDeg <= 180 ? '0' : '1';

    return [
        'M',
        start.x,
        start.y,
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
    ].join(' ');
};

const hasEntryWithType = (entries, type) =>
    entries.some(entry => entry.offers[type] && entry.offers[type].length > 0);

const Marker = props => {
    const { zip, entries, onSelectMarker } = props;

    const renderArc = (offsetIndex, kind) => {
        if (!hasEntryWithType(entries, kind)) {
            return null;
        }
        return (
            <path
                className={kind}
                d={describeArc(
                    markerRadius,
                    markerRadius,
                    markerRadius - 2,
                    10 + offsetIndex * 120,
                    -10 + (offsetIndex + 1) * 120
                )}
            />
        );
    };

    const handleClick = () => onSelectMarker({ zip, entries });

    return (
        <button className="marker" onClick={handleClick}>
            <svg className="indicator">
                <circle
                    cx={markerRadius}
                    cy={markerRadius}
                    r={markerRadius - 2}
                />
                {renderArc(0, 'materials')}
                {renderArc(1, 'tools')}
                {renderArc(2, 'labor')}
            </svg>
            <div className="zip">{zip}</div>
        </button>
    );
};

export const createMarker = props => {
    const newDiv = document.createElement('div');
    ReactDOM.render(<Marker {...props} />, newDiv);
    return newDiv;
};
