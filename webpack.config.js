const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./resources/js/app.js",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.less$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, {
                    loader: 'less-loader',
                    options: {
                        lessOptions: {
                            javascriptEnabled: true
                        }
                    }
                }],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'url-loader',
                  },
                ],
              },

        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        path: path.resolve(__dirname, "public/js"),
        publicPath: "http://localhost:3000/js/",
        filename: "app.js"
    },
    watchOptions: {
      poll: 1000,
      ignored: ["node_modules"]
    },
    devServer: {
        contentBase: path.join(__dirname, "public/"),
        headers: { 'Access-Control-Allow-Origin': '*' },
        port: 3000,
        hotOnly: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
};