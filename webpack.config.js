const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './client/index.js',
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
        new HtmlWebpackPlugin({
            template: 'static/template.html',
        }),
    ],
};
