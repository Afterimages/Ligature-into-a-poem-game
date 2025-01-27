/**
 * ESLint 配置文件
 * 
 * 功能说明：
 * 1. 定义代码规范和检查规则
 * 2. 配置：
 *    - ES6+ 语法支持
 *    - 微信小游戏全局变量
 *    - 模块化支持
 * 3. 用于确保代码质量和一致性
 * 
 * 使用方法：
 * - 需要安装 ESLint 扩展
 * - 编辑器会根据此配置自动检查代码
 */

/*
 * Eslint config file
 * Documentation: https://eslint.org/docs/user-guide/configuring/
 * Install the Eslint extension before using this feature.
 */
module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  ecmaFeatures: {
    modules: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  globals: {
    wx: true,
    App: true,
    Page: true,
    getCurrentPages: true,
    getApp: true,
    Component: true,
    requirePlugin: true,
    requireMiniProgram: true,
  },
  // extends: 'eslint:recommended',
  rules: {},
}
