const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { NetlifyPlugin } = require('netlify-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  //mode: 'development',
  //watch: true,
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
        include: [path.resolve(__dirname, 'src')],
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new EslintPlugin({extensions: 'ts'}),
    /*new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets'},
      ],
    }),*/
    new NetlifyPlugin({redirects: [
        {
          from: "/*",
          to: "/index.html",
          status: 200,
          force: false,
        }        
      ]
    })
  ]
}