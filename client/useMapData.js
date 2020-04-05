import { useState, useEffect } from 'react';
import { useQueryParams } from './util';

const groupItemsByField = (items, fieldName) => {
    const res = {};
    items.forEach(item => {
        const itemValueAtField = item[fieldName];
        if (!res[itemValueAtField]) {
            res[itemValueAtField] = [];
        }
        res[itemValueAtField].push(item);
    });
    return res;
};

const parseDateFromString = (string, separator = '/') => {
    const [month, date, year] = string
        .split(separator)
        .map(piece => parseInt(piece));
    return new Date(year, month - 1, date);
};

const createEventsStream = (donations, notes) => {
    return groupItemsByField(
        [
            ...donations.map(d => ({
                ...d,
                type: 'donation',
            })),
            ...notes,
        ]
            .filter(e => e.date)
            .map(e => ({
                ...e,
                sortValue: parseDateFromString(e.date).valueOf(),
            })),
        'sortValue'
    );
};

export const useMapData = () => {
    const [responses, setResponses] = useState(null);
    const [events, setEvents] = useState(null);
    const { access } = useQueryParams();

    useEffect(() => {
        fetch(`/api/data?access=${access}`)
            .then(res => res.json())
            .then(({ responses, events }) => {
                setResponses(responses);
                setEvents(events);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (responses && events) {
        const { donations, notes } = events;
        return {
            responses: groupItemsByField(responses, 'zip'),
            donations: groupItemsByField(donations, 'locationId'),
            events: createEventsStream(donations, notes),
        };
    }

    return null;
};
