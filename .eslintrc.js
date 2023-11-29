module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  rules: {
    //js rules
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'prefer-arrow-callback': 'error',
    'no-var': 'error',
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'never'],
    'multiline-ternary': ['error', 'never'],
    'indent': ['error', 2, {'MemberExpression':0}],
    'quotes': ['error', 'single', {'avoidEscape':true, 'allowTemplateLiterals':true}],
    'brace-style': ['error', 'stroustrup', {'allowSingleLine': true}],
    'no-empty': ["error", { "allowEmptyCatch": true }],
    //vue rules
    'vue/require-prop-types': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'error',
    'vue/html-quotes': ['error', 'double'],
    'vue/html-indent': ['error', 2, {'baseIndent':0, 'attribute':0, 'alignAttributesVertically': false}],
    'vue/html-closing-bracket-newline': 'error',
    'vue/attribute-hyphenation': 'error',
    'vue/attributes-order': 'off',
    'vue/no-v-html': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
