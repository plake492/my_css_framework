const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgeCssPlugin = require('purgecss-webpack-plugin')

const htmlMiniOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}

module.exports = (_, { mode }) => {
  const htmlFiles = [
    // * For hygen generatinon of html * //
    // ----------new page--------- //
    'flex'
  ]

  const isProd = mode === 'production'

  // Generate array of html plugins
  const multipleHtmlPlugins = htmlFiles.map(
    name =>
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', `${name}.html`),
        filename: `${name}.html`,
        chunks: ['main', `${name}`],
        inject: 'body',
        minify: isProd ? htmlMiniOptions : false
      })
  )

  const webpackConfiguration = {
    entry: './src/js/index.js',
    output: {
      filename: './assets/js/bundle.[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      assetModuleFilename: './assets/js/bundle.[contenthash][ext][query]',
      chunkFilename: './assets/js/bundle.[contenthash].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }
      ]
    },
    optimization: {
      minimizer: [new CssMinimizerPlugin()]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
        filename: 'index.html',
        inject: 'body',
        minify: isProd ? htmlMiniOptions : false,
        chunks: ['main']
      }),
      new MiniCssExtractPlugin({
        filename: './assets/css/[name].[contenthash].css',
        chunkFilename: './assets/css/[id].[contenthash].css'
      })
    ].concat(multipleHtmlPlugins)
  }

  isProd
    ? webpackConfiguration.plugins.push(
        new PurgeCssPlugin({
          paths: glob.sync(path.join(__dirname, 'src') + '/**/*', {
            nodir: true
          })
        })
      )
    : (webpackConfiguration.devtool = 'source-map')

  return webpackConfiguration
}
