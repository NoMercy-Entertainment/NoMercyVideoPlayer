const path = require('path');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    context: path.resolve(__dirname, 'src'),
    // devtool: 'inline-source-map',
    entry: './index.ts',
    mode: 'production',
    devtool: false,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
              test: /\.css$/i,
              include: path.resolve(__dirname, 'src'),
              use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ]
    },
    entry: {
        nomercyplayer: './index.ts',
        base: './base.ts',
        ui: './ui.ts',
        functions: './functions.ts',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'static'),
    },
    resolve: {
        extensions: ['.ts', '.css']
    },
};
