import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

module.exports = {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    output: {
        path: path.resolve(__dirname, 'build'), // Make sure this is 'build'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts']
    },
    plugins: [new HtmlWebpackPlugin()],
}
