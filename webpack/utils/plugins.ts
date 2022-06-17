import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export function getPlugins() {
	return [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../../public/index.html'),
			filename: 'index.html',
		}),
		new ESLintPlugin({
			extensions: ['.js', '.ts'],
			exclude: 'node_modules',
		}),

	];
}
