
let path = require('path');
let webpack = require('webpack');
let ReactHotWebpackPlugin = require('./webpack-plugin');

module.exports = {
    mode: "development",
    entry: ['./client','./example/Example.jsx'],
    output: {
        path: path.resolve(__dirname, './example'),
        filename: 'build.js',
        publicPath: './',
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ReactHotWebpackPlugin()
    ]
}