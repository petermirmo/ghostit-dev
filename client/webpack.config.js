const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  let plugins;

  if (argv.mode == "development")
    plugins = [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico"
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: '"development"'
        }
      })
    ];
  else
    plugins = [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico"
      })
    ];

  return {
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
      path: path.join(__dirname, "/build"),
      publicPath: "/",

      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["es2015", "react", "stage-2"]
            }
          }
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }]
        },
        {
          test: /\.(jpe?g|ico|gif|png|svg|woff|ttf|wav|mp3)$/,
          loader: "file-loader?name=[name].[ext]"
        }
      ]
    },

    plugins: plugins,
    devServer: {
      proxy: {
        "/api/*": "http://localhost:5000"
      },
      disableHostCheck: true,
      historyApiFallback: true
    }
  };
};
