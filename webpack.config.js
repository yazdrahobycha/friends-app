const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const hmtlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        filename: path.resolve(__dirname, 'src/index.js')
    }, 
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        clean: true
    },
    devServer: {
        port: 228,
        compress: true,
        hot: true,
        static: {
            directory: path.join(__dirname, 'dist')
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'My Web Page',
            filename: 'index.html',
            template: 'src/template.html',
            minify: {
                removeRedundantAttributes: false, // do not remove type="text"
              }
        })
    ]
}