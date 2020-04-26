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
            return () => {
                followerColumn.style.maxHeight = '';
            };
        }
        return () => {};
    }, [leaderColumn, followerColumn, forceRerender]);

    return {
        leaderColumnRef: setLeaderColumn,
        followerColumnRef: setFollowerColumn,
        equalizeColumns: () => setForceRerender(val => val + 1),
    };
};

export const useImageLoader = src => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setIsLoaded(true);
        img.src = src;
        return () => setIsLoaded(false);
    }, [src]);

    return isLoaded;
};
