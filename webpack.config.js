const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgeCssPlugin = require('purgecss-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

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
    // ******** For hygen generatinon of html ********* //
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
      assetModuleFilename: './assets/images/[contenthash][ext]',
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
          test: /\.(png|jpg|gif)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8192
            }
          }
        },

        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                url: false // * needed for url in sass
              }
            },
            { loader: 'sass-loader', options: { sourceMap: true } }
          ]
        }
      ]
    },

    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.squooshMinify
          }
        })
      ]
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
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/assets/images'),
            to: path.resolve(__dirname, 'dist/assets/images')
          }
        ]
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
