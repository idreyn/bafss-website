export const requireHttps = (req, res, next) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && process.env.NODE_ENV !== 'development') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
};

export const hasAdminAccess = accessCode =>
    accessCode === process.env.ADMIN_ACCESS_CODE;

export const cache = (fn, lifetimeSeconds) => {
    let lastValue = null;
    let lastCalled = null;
    return async () => {
        const now = Date.now();
        if (!lastValue || now - lastCalled > lifetimeSeconds * 1000) {
            lastValue = await fn();
            lastCalled = now;
        }
        return lastValue;
    };
};

export const preemptiveCache = (fn, lifetimeSeconds) => {
    let latestValue = null;

    const updateValue = async () => {
        const newValue = await fn();
        latestValue = newValue;
        return newValue;
    };

    const initialValuePromise = updateValue();
    setInterval(updateValue, lifetimeSeconds * 1000);

    return async () => {
        if (!latestValue) {
            await initialValuePromise;
        }
        return latestValue;
    };
};
