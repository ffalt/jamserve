const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const app = {
	entry: './src/index.ts',
	target: 'node',
	externals: [nodeExternals(),
		function (context, request, callback) {
			if (request.includes('config.js')) {
				return callback(null, 'commonjs ' + request);
			}
			callback();
		}
	],
	node: {
		__dirname: false,
		__filename: false,
	},
	devtool: "source-map",
	output: {
		filename: 'jamserve.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		// webpack is warning about require(dynamicConfigFilePerParameter) usage
		new FilterWarningsPlugin({
			exclude: /Critical dependency: the request of a dependency is an expression/i
		}),
		new CopyWebpackPlugin([{from: './src/modules/image/avatar-generator/parts', to: './static/avatar/parts'}])
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


const ls = fs.readdirSync('./src/modules/audio/tasks/').filter(item => item.includes('.ts')).map(item => path.basename(item, '.ts'));

const tasks = ls.map(filename => ({
	entry: `./src/modules/audio/tasks/${filename}.ts`,
	target: 'node',
	externals: [nodeExternals()],
	node: {
		__dirname: false,
		__filename: false,
	},
	devtool: "source-map",
	output: {
		filename: `${filename}.js`,
		path: path.resolve(__dirname, 'dist', 'tasks')
	},
	plugins: [],
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
}));

module.exports = [...tasks, app];
