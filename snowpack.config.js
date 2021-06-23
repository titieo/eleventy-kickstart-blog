// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    exclude: [
        '**/node_modules/**/*',
        'src/_data',
        'src/**/*.md',
        'src/**/*.njk',
        'src/**/*.ejs',
    ],
    mount: {
        public: { url: '/', static: true },
        'src/scripts': '/scripts',
        'src/styles': '/styles',
        'src/images': '/images',
    },
    // optimize: {
    //     bundle: true,
    //     minify: true,
    //     target: 'es2017',
    //     treeshake: true,
    // },
    plugins: [
        ['@snowpack/plugin-babel'],
        '@snowpack/plugin-postcss',
        // [
        //   '@snowpack/plugin-build-script',
        //   {
        //     cmd: 'babel --filename $FILE', // cmd to run
        //   },
        // ],
        [
            '@snowpack/plugin-run-script',
            {
                cmd: 'eleventy',
                watch: '$1 --watch',
            },
        ],
        // [
        //     '@snowpack/plugin-webpack',
        //     {
        //         outputPattern: {
        //             css: 'main.css',
        //             js: '[filename].js',
        //         },
        //         extendConfig: (config) => {
        //             config.plugins.push(/* ... */);
        //             return config;
        //         },
        //         sourceMap: false,
        //     },
        // ],
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        { match: 'routes', src: '.*', dest: '/index.html' },
    ],
    packageOptions: {
        source: 'remote',
    },
    devOptions: {
        // https://github.com/tailwindlabs/tailwindcss/issues/3950#issuecomment-846967828
        // tailwindConfig: './tailwind.config.js',
    },
    buildOptions: {
        hmrDelay: 300,
        /* ... */
    },
};
