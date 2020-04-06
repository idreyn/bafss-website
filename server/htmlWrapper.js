import React from 'react';

export const HtmlWrapper = ({ children, appProps, manifest }) => {
    return (
        <html>
            <head>
                <link
                    href={manifest['main.css']}
                    rel="stylesheet"
                    type="text/css"
                />
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.css"
                    rel="stylesheet"
                />
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>SFBA Face Shield Supply</title>
            </head>
            <body>
                <div id="root">{children}</div>
                <script
                    type="text/plain"
                    data-json={JSON.stringify(appProps)}
                    id="app-props"
                />
                <script type="text/javascript" src={manifest['main.js']} />
            </body>
        </html>
    );
};
