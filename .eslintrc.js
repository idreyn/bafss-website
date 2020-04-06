module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "amd": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "prettier"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 11,
        "sourceType": "module",
    },
    "plugins": [
        "react",
        "react-hooks",
        "prettier",
        "import"
    ],
    "rules": {
        "prettier/prettier": "error",
        "react-hooks/rules-of-hooks": 'error',
        'react/no-unescaped-entities': 0,
        "react/prop-types": 0,
        "react-hooks/exhaustive-deps": 'warn'
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    },
};