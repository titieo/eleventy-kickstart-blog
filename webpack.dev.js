const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-cheap-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].min.js',
        clean: true,
        pathinfo: false,
    },
    // plugins: [],
});
