/* eslint-env node */

const { configure } = require('quasar/wrappers');


module.exports = configure(function () {
  return {
    build: {
      target: {
        browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
        node: 'node16'
      },
      vueRouterMode: 'hash',
    },

    devServer: {
      open: true
    },

    framework: {
      plugins: ['Cookies'],
    },

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ['render'],
    },
  }
});
