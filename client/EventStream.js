import React from 'react';
import pluralize from 'pluralize';

import './eventStream.scss';

const renderDonationEventText = donation => {
    const { totalDonations, donationType, locationName } = donation;
    return (
        <>
            <em>
                {totalDonations} {pluralize(donationType, totalDonations)}
            </em>{' '}
            provided to <em>{locationName}</em>
        </>
    );
};

const EventItem = props => {
    const { event } = props;
    const { imageUrl, documentationUrl } = event;

    const eventText =
        event.type === 'donation' ? renderDonationEventText(event) : event.text;

    if (!eventText) {
        return null;
    }

    return (
        <div className="event-item">
            <div className="text">
                {eventText}
                {documentationUrl && (
                    <>
                        <br />
                        <a
                            className="see-more"
                            href={documentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            See more about this
                        </a>
                    </>
                )}
            </div>
            {imageUrl && (
                <a
                    className="image-container"
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={imageUrl} />
                </a>
            )}
        </div>
    );
};

const EventStream = props => {
    const { events } = props;

    if (!events) {
        return (
            <div className="event-stream-component">
                <div className="loading-message">Loading...</div>
            </div>
        );
    }

    const renderEntryForDate = events => {
        if (events.length === 0) {
            return null;
        }
        const [someEvent] = events;
        return (
            <div className="event-stream-date" key={someEvent.date}>
                <div className="date-header">
                    <div className="date-text">{someEvent.date}</div>
                    <div className="date-bar" />
                </div>
                {events.map((event, index) => (
                    <EventItem event={event} key={index} />
                ))}
            </div>
        );
    };

    // Some behavior we're implicitly relying on here -- Object.keys (and thus Object.values) will
    // yield its integer keys in ascending order. Since `events` has unix timestamp keys, we can
    // get a reverse timeline by looking at its Object.values in reverse order.
    const entriesInOrder = Object.values(events).reverse();

    return (
        <div className="event-stream-component">
            {entriesInOrder.map(renderEntryForDate)}
        </div>
    );
};

export default EventStream;
