import path from 'path';
import express from 'express';
import forceHttps from 'express-force-https';

try {
    require('./secrets.js');
} catch (_) {
    // Presumably we're in production where this file doesn't exist
}

import { getResponses } from './responses';
import { hasAdminAccess } from './util';
import { getEvents } from './events';

const staticRoot = path.normalize(path.join(__dirname, '..', 'dist'));
const app = express();

app.use(forceHttps);
app.use(express.static(staticRoot));

app.get('/api/data', (req, res, next) => {
    const {
        query: { access },
    } = req;
    return Promise.all([getResponses(hasAdminAccess(access)), getEvents()])
        .then(([responses, events]) =>
            res.status(200).json({ responses, events })
        )
        .catch(next);
});

app.listen(process.env.PORT || 2039);
