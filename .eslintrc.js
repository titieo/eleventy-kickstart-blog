module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['google'],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['html', '@babel', 'prettier'],
    rules: {
        quotes: ['error', 'single'],
    },
};
