const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        optimization: {
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),  // CSS sıkıştırması burada gerçekleşecek
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CompressionPlugin({
                test: /\.(js|css|html|svg|glb)$/,
                filename: '[path][base].br',
                algorithm: 'brotliCompress',
                compressionOptions: { level: 11 },
                threshold: 10240,
                minRatio: 0.8,
            }),
        ]
    }
);

