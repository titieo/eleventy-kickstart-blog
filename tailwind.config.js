module.exports = {
    mode: 'jit',
    purge: {
        content: [
            './src/**/*.js',
            './src/**/*.md',
            './src/**/*.njk',
            './src/**/*.ejs',
        ],
        options: {
            keyframes: true,
            fontFace: true,
            safelist: [/data-theme$/],
        },
    },
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [require('daisyui')],
};
