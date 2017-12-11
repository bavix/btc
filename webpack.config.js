const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "[name]",
    disable: process.env.NODE_ENV === 'development'
});

const extractHtml = new ExtractTextPlugin({
    filename: "[name]",
    disable: process.env.NODE_ENV === 'development'
});

module.exports = {

    context: path.resolve(__dirname, './')

    , entry: {
        'css/app.css': './css/app.sass'
        , 'index.html': './index.pug'
    }

    , output: {
        path: path.resolve(__dirname, './')
        , filename: '[name]'
    }

    , devtool: 'source-map'

    , module: {
        rules: [

            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff',
                        name: 'fonts/[name].[ext]'
                    }
                }
            },

            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            },

            {
                test: /\.(png|jpe?g)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'image/[name].[ext]'
                    }
                }
            },

            {
                test: /\.(s[ac]ss)$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: 'css-loader'
                            , options: {
                                minimize: true,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'resolve-url-loader'
                        },
                        {
                            loader: 'sass-loader'
                            , options: {
                                minimize: true,
                                sourceMap: true
                            }
                        }
                    ],

                    fallback: 'style-loader'
                })
            },

            {
                test: /\.(pug)$/
                , use: extractHtml.extract({
                    use: [
                        {
                            loader: 'html-loader'
                        },
                        {
                            loader:'pug-html-loader?pretty&exports=false'
                        }
                    ]
                })
            }
        ]
    }

    , externals: [{ window: 'window' }]

    , plugins: [
        new UglifyJSPlugin({ comments: false })
        , extractSass
        , extractHtml
    ]

};