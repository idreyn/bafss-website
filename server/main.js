import path from 'path';

import express from 'express';

const staticRoot = path.normalize(path.join(__dirname, '..', 'dist'));
const app = express();

app.use(express.static(staticRoot));
app.listen(process.env.PORT || 2039);
