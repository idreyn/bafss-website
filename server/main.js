import path from 'path';

import express from 'express';

import { loadAndCollateResponses } from './data';

const staticRoot = path.normalize(path.join(__dirname, '..', 'dist'));
const app = express();

app.use(express.static(staticRoot));
app.get('/api/responses', (_, res) => {
    return loadAndCollateResponses().then(responses =>
        res.status(200).json({ responses })
    );
});

app.listen(process.env.PORT || 2039);

const oof = async () => {
    const data = await loadAndCollateResponses();
    console.log(data);
};

oof();
