const path = require('path');
const nodeExternals = require('webpack-node-externals');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

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
	plugins: [
		// webpack is warning about require(dynamicConfigFilePerParameter) usage
		new FilterWarningsPlugin({
			exclude: /Critical dependency: the request of a dependency is an expression/i
		})
	],
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
