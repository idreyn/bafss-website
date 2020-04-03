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

export const useMapData = () => {
    const [responses, setResponses] = useState(null);
    const [donations, setdonations] = useState(null);
    const { access } = useQueryParams();

    useEffect(() => {
        fetch(`/api/mapData?access=${access}`)
            .then(res => res.json())
            .then(({ responses, donations }) => {
                setResponses(responses);
                setdonations(donations);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (responses && donations) {
        return {
            responses: groupItemsByField(responses, 'zip'),
            donations: groupItemsByField(donations, 'locationName'),
        };
    }

    return null;
};
