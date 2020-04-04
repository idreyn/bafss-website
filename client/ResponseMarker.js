import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import './responseMarker.scss';

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

export const ResponseMarker = props => {
    const { zip, entries, onSelectMarker } = props;

    const renderArc = (offsetIndex, kind) => {
        return (
            <path
                className={classNames(
                    kind,
                    !hasEntryWithType(entries, kind) && 'hidden'
                )}
                d={describeArc(
                    markerRadius,
                    markerRadius,
                    markerRadius - 2,
                    45 + (10 + offsetIndex * 90),
                    45 + (-10 + (offsetIndex + 1) * 90)
                )}
            />
        );
    };

    const handleClick = () => onSelectMarker({ zip, entries });

    return (
        <button className="response-marker-component" onClick={handleClick}>
            <svg className="indicator">
                <circle
                    cx={markerRadius}
                    cy={markerRadius}
                    r={markerRadius - 2}
                />
                {renderArc(0, 'materials')}
                {renderArc(1, 'tools')}
                {renderArc(2, 'labor')}
                {renderArc(3, 'funding')}
            </svg>
            <div className="zip">{zip}</div>
        </button>
    );
};

export const createResponseMarker = props => {
    const container = document.createElement('div');
    ReactDOM.render(<ResponseMarker {...props} />, container);
    return container;
};
