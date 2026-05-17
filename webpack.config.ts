import path from 'path';
import type { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const config = (_env: Record<string, unknown>): Configuration => ({
  context: path.join(__dirname, 'src'),
  devtool: 'source-map',

  entry: { module: './module.ts' },

  // Grafana injecte ces packages via SystemJS — ne pas les bundler
  externals: {
    '@grafana/ui': '@grafana/ui',
    '@grafana/data': '@grafana/data',
    '@grafana/runtime': '@grafana/runtime',
    react: 'react',
    'react-dom': 'reactDom',
  },

  output: {
    clean: true,
    filename: '[name].js',
    libraryTarget: 'amd',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'public/plugins/bamp-panel/',
  },

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.[tj]sx?$/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              target: 'es2018',
              parser: { syntax: 'typescript', tsx: true },
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: '../plugin.json', to: '.' }],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: { configFile: path.join(__dirname, 'tsconfig.json') },
    }),
  ],

  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
});

export default config;
