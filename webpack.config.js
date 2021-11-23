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
    dataVisualization: path.resolve(
      __dirname,
      "client/public/js/dataVisualization.js"
    ),
  },

  // devtool: "inline-source-map",

  // devServer: {
  //   contentBase: path.resolve(__dirname, "dist"),
  //   open: true,
  //   hot: true,
  // },

  output: {
    path: path.resolve(__dirname, "client/dist"),
    filename: "[name].bundle.js",
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
