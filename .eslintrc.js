module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['standard','prettier'],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['html', '@babel'],
    rules: {
        quotes: ['error', 'single'],
    },
};
