import * as path from 'path';

import { getModule, getPlugins } from './utils';

const root = (absolutePath: string) =>
	path.resolve(__dirname, `../${absolutePath}`);

export default {
	mode: 'development',
	context: path.resolve(__dirname, '../src'),
	entry: './index.ts',
	devtool: 'inline-source-map',
	output: {
		filename: '[name].bundle.js',
		path: root('build'),
		clean: true,
	},
	devServer: {
		port: 3000,
		hot: true,
		open: true,
		compress: true,
		historyApiFallback: true,
		static: {
			directory: root('/build'),
		},
	},
	module: getModule(),
	plugins: getPlugins(),
	resolve: {
		alias: {
			'@': root('src/'),
		},
		extensions: ['.ts', '.js', '.json'],
	},
};
