const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  // 开发环境中的 Source Maps 通常是默认启用的，但你可以显式设置
  configureWebpack: {
    devtool: 'source-map' // or another preferred option like 'eval-source-map' for faster builds
  },

  // 如果需要在生产环境中启用 Source Maps
  productionSourceMap: true, // 默认情况下这是 false，如果你想在生产中启用可以设置为 true
});