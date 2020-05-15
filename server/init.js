try {
    require('./secrets.js');
} catch (_) {
    // Presumably we're in production where this file doesn't exist
}

require('@babel/register')({
    presets: [
        ['@babel/preset-env', { targets: { node: '12' } }],
        '@babel/preset-react',
    ],
    plugins: [
        ['babel-plugin-transform-require-ignore', { extensions: ['.scss'] }],
    ],
});

require('./main');
