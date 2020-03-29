import path from 'path';

import express from 'express';

try {
    require('./secrets.js');
} catch (_) {
    // Presumably we're in production where this file doesn't exist
}

import { getResponses } from './responses';
import { getDropoffs } from './dropoffs';
import { hasAdminAccess } from './util';

const staticRoot = path.normalize(path.join(__dirname, '..', 'dist'));
const app = express();

app.use(express.static(staticRoot));

app.get('/api/mapData', (req, res, next) => {
    const {
        query: { access },
    } = req;
    return Promise.all([getResponses(hasAdminAccess(access)), getDropoffs()])
        .then(([responses, dropoffs]) =>
            res.status(200).json({ responses, dropoffs })
        )
        .catch(next);
});

app.listen(process.env.PORT || 2039);
