module.exports = {
  parser: 'vue-eslint-parser',// 用於解析 .vue 文件
  parserOptions: {
    parser: '@babel/eslint-parser',// 用於解析最新的 JavaScript 語法
    ecmaVersion: 2020,// 支持的 ECMAScript 版本
    sourceType: 'module',// 使用 ES modules
    requireConfigFile: false // 不需要 Babel 配置文件
  },
  extends: [
    'plugin:vue/vue3-essential', // Vue 3.x 的基本規則
    'eslint:recommended' // ESLint 推薦的規則
  ],
  env: {
    browser: true, // 允許使用瀏覽器全局變量
    node: true // 允許使用 Node.js 全局變量
  },
  rules: {
    // 您的自定義規則
  }
};