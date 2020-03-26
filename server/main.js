import path from 'path';

import express from 'express';

import { requireHttps } from './util';

try {
    require('./secrets.js');
} catch (_) {
    // Presumably we're in production where this file doesn't exist
}

import { loadAndCollateResponses } from './data';

const staticRoot = path.normalize(path.join(__dirname, '..', 'dist'));
const app = express();

app.use(express.static(staticRoot));
app.use(requireHttps);

app.get('/api/responses', (_, res, next) => {
    return loadAndCollateResponses()
        .then(responses => res.status(200).json({ responses }))
        .catch(next);
});

app.listen(process.env.PORT || 2039);
