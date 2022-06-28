// typescript
const ts = {
	test: /\.ts$/,
	use: 'ts-loader',
	exclude: /node_modules/,
};

// babel
const babel = {
	test: /\.ts$/,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader',
		options: {
			presets: ['@babel/preset-env'],
			plugins: [
				['@babel/plugin-transform-runtime'],
				['@babel/plugin-transform-modules-commonjs'],
				['@babel/plugin-proposal-decorators', { legacy: true }],
				['@babel/plugin-proposal-class-properties', { loose: false }],
			],
		},
	},
};

const img = {
	test: /\.(png|svg|jpg|jpeg|gif)$/i,
	type: 'asset/resource',
};

const css = {
	test: /\.s[ac]ss$/i,
	use: ['style-loader', 'css-loader', 'sass-loader'],
};

const fonts = {
	test: /\.(woff|woff2|eot|ttf|otf)$/i,
	type: 'asset/inline',
};

export function getModule() {
	return {
		rules: [babel, ts, css, img, fonts],
	};
}
