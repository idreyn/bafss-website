import React from 'react';
import ReactDOM from 'react-dom';

import '../config';

import App from './App';

const appProps = JSON.parse(
    document.getElementById('app-props').getAttribute('data-json')
);

ReactDOM.hydrate(<App {...appProps} />, document.getElementById('root'));
