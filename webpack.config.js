const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
    // ...existing configuration...
    plugins: [
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env.API_URL':
            JSON.stringify(process.env.API_URL),
        })
    ],
};