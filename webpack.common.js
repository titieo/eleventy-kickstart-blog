const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const entries = glob.sync(
    path.resolve(__dirname, 'src/images/*.{png,gif,jpg,jpeg}'),
);
entries.push(path.resolve(__dirname, 'src/main.css'));
entries.push(path.resolve(__dirname, 'src/index.js'));

module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },

        // runtimeChunk: 'single',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                // Apply rule for .sass, .scss or .css files
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                // Now we apply rule for images
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        // Using file-loader for these files
                        loader: 'file-loader',

                        // In options we can set different things like format
                        // and directory to save
                        options: {
                            outputPath: 'images/[name].[ext]',
                        },
                    },
                ],
            },
            {
                // Apply rule for fonts files
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                use: [
                    {
                        // Using file-loader too
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'webpack.html'),
            filename: path.resolve(__dirname, 'src/_includes/webpack.ejs'),
            inject: false,
        }),
        new FaviconsWebpackPlugin({
            logo: './src/logo.png',
            inject: true,
        }),
    ],
};
