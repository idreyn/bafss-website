import { useEffect, useState } from 'react';

export const useColumnEqualizer = () => {
    const [leaderColumn, setLeaderColumn] = useState(null);
    const [followerColumn, setFollowerColumn] = useState(null);

    useEffect(() => {
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
