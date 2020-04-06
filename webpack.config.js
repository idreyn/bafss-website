const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './client/index.js',
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] },
        ],
    },
    plugins: [
        new CopyPlugin([
            {
                from: path.resolve(__dirname, 'static/images'),
                to: 'images',
            },
        ]),
    ],
};
