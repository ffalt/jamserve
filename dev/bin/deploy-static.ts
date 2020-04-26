import fse from 'fs-extra';
import {exec} from 'child_process';

export async function spawnNPM(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		exec('npm i -q', {
			cwd: './dist',
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
	const pack = await fse.readJSON('package.json');
	const result: any = {
		name: pack.name,
		author: pack.author,
		license: pack.license,
		repository: pack.repository,
		scripts: {
			start: 'node jamserve.js',
			clearDB: 'node jamserve.js --cleardb'
		},
		engines: pack.engines,
		dependencies: pack.dependencies,
	};
	await fse.ensureDir('dist');
	await fse.writeJson('dist/package.json', result, {spaces: 2});
	await spawnNPM();
	await fse.remove('dist/node_modules');
	await fse.copy('LICENSE', 'dist/LICENSE');
	await fse.copy('README.md', 'dist/README.md');
}

start()
	.then(() => {
		process.exit(0);
	})
	.catch(e => {
		console.log(e);
		process.exit(1);
	});
