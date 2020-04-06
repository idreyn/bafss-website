import { getResponses } from './responses';
import { getEvents } from './events';

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

export const getPageData = async (showPrivateView = false) => {
    const [responses, { donations, notes }] = await Promise.all([
        getResponses(showPrivateView),
        getEvents(),
    ]);
    return {
        responses: groupItemsByField(responses, 'zip'),
        donations: groupItemsByField(donations, 'locationId'),
        events: createEventsStream(donations, notes),
    };
};
