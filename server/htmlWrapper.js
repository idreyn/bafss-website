import React from 'react';

export const HtmlWrapper = ({ children, appProps }) => {
    return (
        <html>
            <head>
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.css"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap"
                    rel="stylesheet preload"
                />
                <meta charset="UTF-8" />
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
                <script type="text/javascript" src="main.bundle.js" />
            </body>
        </html>
    );
};
