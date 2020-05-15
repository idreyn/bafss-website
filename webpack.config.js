const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './client/index.js',
    output: {
        filename: '[name].[contenthash].bundle.js',
        chunkFilename: '[name].[contenthash].bundle.js',
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
                use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] },
        ],
    },
    plugins: [
        new ManifestPlugin(),
        new MiniCSSExtractPlugin({
            filename: '[name].[contenthash].bundle.css',
        }),
        new CopyPlugin([
            {
                from: path.resolve(__dirname, 'static/images'),
                to: 'images',
            },
            {
                from: path.resolve(__dirname, 'static/assets'),
                to: 'assets',
            },
        ]),
    ],
};
