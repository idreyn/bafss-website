import React from 'react';
import pluralize from 'pluralize';

import ImageCard from './ImageCard';

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

const htmlBody = bodyString => (
    <span dangerouslySetInnerHTML={{ __html: bodyString }} />
);

const EventItem = props => {
    const { event } = props;
    const { imageUrl, documentationUrl } = event;

    const eventBody =
        event.type === 'donation'
            ? renderDonationEventText(event)
            : htmlBody(event.body);

    if (!eventBody) {
        return null;
    }

    return (
        <div className="event-item">
            <div className="text">
                {eventBody}
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
                    <ImageCard src={imageUrl} />
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

    const entriesInOrder = Object.values(events).reverse();

    return (
        <div className="event-stream-component">
            {entriesInOrder.map(renderEntryForDate)}
        </div>
    );
};

export default EventStream;
