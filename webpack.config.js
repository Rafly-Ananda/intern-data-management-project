const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    uploadController: path.resolve(
      __dirname,
      "client/public/js/uploadController.js"
    ),
    viewController: path.resolve(
      __dirname,
      "client/public/js/viewController.js"
    ),
    deleteController: path.resolve(
      __dirname,
      "client/public/js/deleteController.js"
    ),
  },

  output: {
    path: path.resolve(__dirname, "client/dist"),
    filename: "[name].bundle.js",
    assetModuleFilename: "src/assets/images/[name].[ext]",
  },

  module: {
    rules: [
      { test: /\.(svg|ico|png|webp|jpg|gif|jpeg)$/, type: "asset/resource" },
    ],
  },

  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: "Database Management",
  //     filename: "index.html",
  //     template: path.resolve(__dirname, "client/public/index.html"),
  //   }),
  //   new HtmlWebpackPlugin({
  //     title: "Database Management",
  //     filename: "uploadData.html",
  //     template: path.resolve(__dirname, "client/public/views/uploadData.html"),
  //   }),
  //   new HtmlWebpackPlugin({
  //     title: "Database Management",
  //     filename: "viewData.html",
  //     template: path.resolve(__dirname, "client/public/views/viewData.html"),
  //   }),
  // ],
};
