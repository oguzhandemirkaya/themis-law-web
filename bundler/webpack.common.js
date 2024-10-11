const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, '../src/script.js'),
    output: {
        hashFunction: 'xxhash64',
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',  // Kök dizinden dosya yollarını belirtir
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static'), to: 'static' }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            inject: 'body',  // Otomatik olarak CSS ve JS dosyalarını inject eder
            minify: true
        }),
        new MiniCSSExtractPlugin({
            filename: '[name].[contenthash].css',
        })
    ],
    module: {
        rules: [
            // HTML Loader
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },
            // JavaScript Loader
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            // CSS Loader
            {
                test: /\.css$/,
                use: [MiniCSSExtractPlugin.loader, 'css-loader']
            },
            // Image Loader
            {
                test: /\.(jpg|png|gif|svg|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[hash][ext]'
                }
            },
            // Font Loader
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[hash][ext]'
                }
            },
            // Shader Loader
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: 'asset/source',
                generator: {
                    filename: 'assets/shaders/[hash][ext]'
                }
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },

};
