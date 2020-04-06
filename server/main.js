import path from 'path';
import express from 'express';
import forceHttps from 'express-force-https';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

import App from '../client/App';

import { HtmlWrapper } from './htmlWrapper';
import { getPageData } from './data';

const staticRoot = path.normalize(path.join(__dirname, '..', 'dist'));
const manifest = require(path.join(staticRoot, 'manifest.json'));
const app = express();

app.use(forceHttps);
app.use(express.static(staticRoot));

app.get('/', (req, res) => {
    return getPageData().then(pageData => {
        const appProps = { pageData, expandMap: false };
        return ReactDOMServer.renderToNodeStream(
            <HtmlWrapper appProps={appProps} manifest={manifest}>
                <App {...appProps} />
            </HtmlWrapper>
        ).pipe(res);
    });
});

app.listen(process.env.PORT || 2039);
