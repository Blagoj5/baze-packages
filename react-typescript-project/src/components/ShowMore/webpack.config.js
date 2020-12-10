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
        test: /\.js$/,
        exclude: /node_modules/,
        use: [],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'css/', name: '[name].min.css' },
          },
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
  },
};
