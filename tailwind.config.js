module.exports = {
    mode: 'jit',
    purge: {
        content: ['./src/**/*.html', './src/**/*.js'],
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
