const path = require('path');

module.exports = {
  entry: [__dirname + '/ShowMore.tsx', __dirname + '/ShowMore.module.scss'],
  //   output: {
  //     path: path.resolve(__dirname, 'dist'),
  //     filename: 'js/ShowMore.min.js',
  //   },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            // options: { outputPath: 'css/', name: '[name].min.css' },
            options: { outputPath: 'css/', name: 'ShowMore.min.css' },
          },
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'ShowMoreBundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },
};
