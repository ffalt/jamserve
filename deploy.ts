import fse from 'fs-extra';
import {exec} from 'child_process';

export async function spawnNPM(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		exec('npm i -q', {
			cwd: './deploy',
		}, function(error, stdout, stderr) {
			console.log(stdout);
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

export async function spawnMikroOrm(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		exec('npx mikro-orm cache:generate', {
			cwd: './deploy',
		}, function(error, stdout, stderr) {
			console.log(stdout);
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

async function start(): Promise<void> {
	console.log('Cleaning output path "deploy"');
	await fse.remove('deploy');
	console.log('Create output path "deploy"');
	await fse.ensureDir('deploy');
	console.log('Create production package.json');
	const pack = await fse.readJSON('package.json');
	const result: any = {
		name: pack.name,
		version: pack.version,
		author: pack.author,
		description: pack.description,
		license: pack.license,
		repository: pack.repository,
		scripts: {
			start: 'node dist/index.js'
		},
		"mikro-orm": {
			"useTsNode": false,
			"configPaths": [
				"./dist/config/orm.config.js"
			]
		},
		engines: pack.engines,
		dependencies: pack.dependencies,
	};
	await fse.writeJson('deploy/package.json', result, {spaces: 2});
	console.log('Create production package-lock.json');
	await spawnNPM();
	console.log('Copy software files');
	await fse.copy('dist', 'deploy/dist');
	console.log('Copy orm files');
	await fse.copy('src', 'deploy/src');
	await fse.copy('tsconfig.json', 'deploy/tsconfig.json');
	console.log('Copy static files');
	await fse.copy('static', 'deploy/static');
	console.log('Copy doc files');
	await fse.copy('LICENSE', 'deploy/LICENSE');
	await fse.copy('README.md', 'deploy/README.md');
	console.log('Create orm cache');
	await spawnMikroOrm();
	console.log('Cleanup "deploy/node_modules"');
	await fse.remove('deploy/node_modules');
	console.log('Cleanup "deploy/src"');
	await fse.remove('deploy/src');
	console.log('done.');
}

start()
	.then(() => {
		process.exit(0);
	})
	.catch(e => {
		console.log(e);
		process.exit(1);
	});
