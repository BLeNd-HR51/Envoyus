module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'mocha': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:import/errors'
    ],
    'parserOptions': {
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },
    'plugins': [
        'react',
        'import'
    ],
    'globals': {
        'deepEqual': true,
        'describe': true,
        'document': true,
        'it': true,
        'expect': true,
        'module': true,
        'test': true,
        'window': true,
        'sinon': true,
        'console': true,
        'require': true
    },
    'rules': {
        'import/first': 2,
        'import/newline-after-import': 2,
        'import/newline-after-import': 2,
        'import/no-duplicates': 2,
        'import/no-unresolved': 0,
        'import/order': 2,
        'indent': ['error', 4],
        'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error'] }] : 0,
        'semi': ['error', 'always'],
        'space-before-function-paren': 0
    }
};