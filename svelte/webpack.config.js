const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
    entry: {
        bundle: ['./src/main.ts']
    },
    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
        extensions: ['.mjs', '.js', '.svelte', '.ts'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        fallback: {
            crypto: false
        }
    },
    output: {
        path: __dirname + '/public/build',
        filename: '[name].js',
        chunkFilename: '[name].[id].js'
    },
    devServer: {
        contentBase: path.join(__dirname, '/public'),
        publicPath: '/build/',
        compress: true,
        port: 5000
    },
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        hotReload: true,
                        preprocess: require('svelte-preprocess')({})
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    mode,
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    devtool: prod ? false : 'source-map'
};
