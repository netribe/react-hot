
let path = require('path');
let webpack = require('webpack');
let ReactHotWebpackPlugin = require('./webpack-plugin.js');

module.exports = {
    mode: "development",
    entry: './example/Example.jsx',
    output: {
        path: path.resolve(__dirname, './example'),
        filename: 'build.js',
        publicPath: './'
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