const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './assets/js/index.js',
    output: {
        filename: 'js/index.min.js',
        path: path.resolve(__dirname, './dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'assets/js'),
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test:/\.(s*)css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                include: /images/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/',
                            publicPath: 'images/'
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/style.css',
        }),
        new HtmlWebpackPlugin({
            template: './templates/index.html',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './assets/images',
                    to: 'images',
                },
            ],
        }),
    ],
};
