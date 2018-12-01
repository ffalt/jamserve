const path = require('path');
const nodeExternals = require('webpack-node-externals');

const app = {
	entry: './src/index.ts',
	target: 'node',
	externals: [nodeExternals(),
		function (context, request, callback) {
			if (request.indexOf('config.js') >= 0) {
				return callback(null, 'commonjs ' + request);
			}
			callback();
		}
	],
	devtool: "source-map",
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							compilerOptions: {removeComments: true}
						}
					}
				],
				exclude: [/node_modules/]
			}
		]
	},
	resolve: {
		extensions: ['.ts']
	}
};

module.exports = [app];
