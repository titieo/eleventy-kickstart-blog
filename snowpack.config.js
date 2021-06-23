// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    exclude: ['**/node_modules/**/*', 'src/_data'],
    mount: {
        public: '/',
    },
    plugins: [
        ['@snowpack/plugin-babel'],
        '@snowpack/plugin-postcss',
        [
            '@snowpack/plugin-webpack',
            {
                outputPattern: {
                    css: 'main.css',
                    js: '[filename].js',
                },
                extendConfig: (config) => {
                    config.plugins.push(/* ... */);
                    return config;
                },
                sourceMap: false,
            },
        ],
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        { match: 'routes', src: '.*', dest: '/index.html' },
    ],
    packageOptions: {
        /* ... */
    },
    devOptions: {
        tailwindConfig: './tailwind.config.js',
    },
    buildOptions: {
        hmrDelay: 300,
        /* ... */
    },
};
