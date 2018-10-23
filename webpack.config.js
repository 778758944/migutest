var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const theme = require("./package.json").theme;

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "./app.js"
    },
    devServer: {
        disableHostCheck: true,
    },
    module: {
        rules: [
            /*
            {
                test: /\.jsx?/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ]
                    }
                },
                exclude: /node_modules/,
            },
            */
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.(css|less)$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "postcss-loader"},
                    {loader: "less-loader", options: {modifyVars: theme}},
                ]
            },
            {
                test: /(\.(png|gif|jpeg|jpg)$)/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192
                        }
                    },
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "svg-sprite-loader"
                    }
                ]
            },
            {
                test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]?[hash]',
						}
					}
				]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "MiguTest",
            filename: "./index.html",
            template: "./template/index-temp.html"
        })
    ],
    resolve: {
        // 引入文件可以省略后缀
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.web.js', '.json'],
        /*
        alias: {
            "react": "tomxingreact/src/React.ts",
            "react-dom": "tomxingreact/src/ReactDOM.ts"
        }
        */
    }
}