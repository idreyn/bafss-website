import { useEffect, useState } from 'react';

const getEffectiveHeight = el => {
    const { top } = el.getBoundingClientRect();
    const childrenBottom = [...el.children].reduce(
        (max, ch) => Math.max(max, ch.getBoundingClientRect().bottom),
        0
    );
    return childrenBottom - top;
};

export const useColumnEqualizer = () => {
    const [leaderColumn, setLeaderColumn] = useState(null);
    const [followerColumn, setFollowerColumn] = useState(null);
    const [forceRerender, setForceRerender] = useState(0);

    useEffect(() => {
        if (leaderColumn && followerColumn) {
            const leaderHeight = getEffectiveHeight(leaderColumn);
            followerColumn.style.maxHeight = `${leaderHeight}px`;
            console.log(followerColumn.style.maxHeight);
            return () => {
                followerColumn.style.maxHeight = '';
            };
        }
        return () => {};
    }, [leaderColumn, followerColumn]);

    return {
        leaderColumnRef: setLeaderColumn,
        followerColumnRef: setFollowerColumn,
        equalizeColumns: () => setForceRerender(val => val + 1),
    };
};
