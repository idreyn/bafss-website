import path from 'path';
import express from 'express';
import forceHttps from 'express-force-https';

try {
    require('./secrets.js');
} catch (_) {
    // Presumably we're in production where this file doesn't exist
}

import { getResponses } from './responses';
import { getDonations } from './donations';
import { hasAdminAccess } from './util';

const staticRoot = path.normalize(path.join(__dirname, '..', 'dist'));
const app = express();

app.use(forceHttps);
app.use(express.static(staticRoot));

app.get('/api/mapData', (req, res, next) => {
    const {
        query: { access },
    } = req;
    return Promise.all([getResponses(hasAdminAccess(access)), getDonations()])
        .then(([responses, donations]) =>
            res.status(200).json({ responses, donations })
        )
        .catch(next);
});

app.listen(process.env.PORT || 2039);
