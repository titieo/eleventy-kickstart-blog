const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-cheap-source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css',
        }),
    ],
});
