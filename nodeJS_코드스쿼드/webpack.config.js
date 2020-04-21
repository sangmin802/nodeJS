const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry : {
    main : './public/js/main.js',
    form : './public/js/form.js'
  },
  output : {
    filename : './js/[name].js',
    path : path.join(__dirname, 'build')
  },
  module : {
    rules : [
      {
        test : /\.js$/,
        include : path.join(__dirname, 'public', 'js'),
        use : {
          loader : 'babel-loader',
          options : {
            presets : [
              ['@babel/preset-env'],
            ]
          }
        }
      },
    ]
  },
  plugins : [
    new HtmlWebpackPlugin({
      hash : true,
      tmeplate : path.join(__dirname,'views','main.ejs'),
      filename : 'main.html',
      chunks : ['main']
    }),
    new HtmlWebpackPlugin({
      hash : true,
      template : path.join(__dirname,'public','signIn.html'),
      filename : 'signIn.html',
      chunks : ['form']
    }),
    new HtmlWebpackPlugin({
      hash : true,
      template : path.join(__dirname,'public','signUp.html'),
      filename : 'signUp.html',
      chunks : ['form']
    })
  ]
}