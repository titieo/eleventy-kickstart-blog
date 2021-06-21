const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            `...`,
            new CssMinimizerPlugin({
                exclude: /\/node_modules/,
            }),
        ],
        // runtimeChunk: 'single',
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                    ['gifsicle', { interlaced: true }],
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 5 }],
                    // Svgo configuration here https://github.com/svg/svgo#configuration
                    [
                        'svgo',
                        {
                            plugins: extendDefaultPlugins([
                                {
                                    name: 'removeViewBox',
                                    active: false,
                                },
                                {
                                    name: 'addAttributesToSVGElement',
                                    params: {
                                        attributes: [
                                            {
                                                xmlns: 'http://www.w3.org/2000/svg',
                                            },
                                        ],
                                    },
                                },
                            ]),
                        },
                    ],
                ],
            },
        }),
    ],
});
