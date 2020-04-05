import { useLayoutEffect, useState } from 'react';

export const useQueryParams = () => {
    if ('URLSearchParams' in window) {
        const urlParams = new URLSearchParams(window.location.search);
        const res = {};
        [...urlParams.entries()].map(([key, value]) => {
            res[key] = value;
        });
        return res;
    }
    return {};
};

export const useColumnEqualizer = () => {
    const [leaderColumn, setLeaderColumn] = useState(null);
    const [followerColumn, setFollowerColumn] = useState(null);

    useLayoutEffect(() => {
        if (leaderColumn && followerColumn) {
            const {
                height: leaderHeight,
            } = leaderColumn.getBoundingClientRect();
            followerColumn.style.maxHeight = `${leaderHeight}px`;
            return () => {
                followerColumn.style.maxHeight = '';
            };
        }
        return () => {};
    }, [leaderColumn, followerColumn]);

    return {
        leaderColumnRef: setLeaderColumn,
        followerColumnRef: setFollowerColumn,
    };
};
