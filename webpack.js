const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");


module.exports = {
    mode: "development",
    entry: "./static/app.jsx",
    devtool: 'source-map',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public")
    },
    plugins: [
        new CleanWebpackPlugin(["public"]),
        new CopyWebpackPlugin([{
            from: "static",
            to: "",
            ignore: [
                "*.jsx",
                "*.ejs"
            ]
        }]),
    ],
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel-preset-react"]
                    }
                }
            }
        ]
    }    
}