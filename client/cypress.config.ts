// cypress.config.js
const { defineConfig } = require("cypress");
const path = require("path");

module.exports = defineConfig({
  projectId: "3eej9n",

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig: require(path.resolve(__dirname, "webpack.config.js")), // Use Webpack config with alias
    },
  },

  video: false,

  e2e: {
    setupNodeEvents() {
      // Implement node event listeners here
    },
    baseUrl: 'http://localhost:3000', // Adjust to your app's URL
  },
});
