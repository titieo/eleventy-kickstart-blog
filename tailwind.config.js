module.exports = {
    mode: 'jit',
    purge: {
        content: [
            './public/**/*.html',
            './public/**/*.css',
            './public/**/*.js',
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
