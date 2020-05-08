const yauzl = require("yauzl");
const path = require("path");
const fse = require("fs-extra");
const http = require("http");
const tmp = require("tmp");
const request = require("request");
const child_process = require("child_process");
const __ELASTIC__ = require("./src/db/elasticsearch/db-elastic.spec.consts.json");

function log(...args) {
	// console.log(args.join(' '));
}

async function fileDeleteIfExists(pathName) {
	const exists = await fse.pathExists(pathName);
	if (exists) {
		await fse.unlink(pathName);
	}
}

async function downloadFile(url, filename) {
	return new Promise((resolve, reject) => {
		request.get(url)
		.on('error', (err) => {
			reject(err);
		})
		.on('complete', (res) => {
			if (res.statusCode !== 200) {
				fileDeleteIfExists(filename).then(() => {
					reject(new Error(http.STATUS_CODES[res.statusCode]));
				}).catch(e => {
					reject(new Error(http.STATUS_CODES[res.statusCode]));
				});
			} else {
				resolve();
			}
		})
		.pipe(fse.createWriteStream(filename));
	});
}

function isDirectoryName(s) {
	return /\/$/.test(s);
}

async function extractArchive(archive, targetDir, extractPath) {
	return new Promise((resolve, reject) => {
		yauzl.open(archive, {lazyEntries: true}, (err, zipfile) => {
			if (err || !zipfile) {
				return reject(err);
			}
			zipfile.readEntry();
			zipfile.on('close', resolve);
			zipfile.on('entry', entry => {
				let fileName = entry.fileName;
				if (extractPath && fileName.startsWith(extractPath)) {
					fileName = fileName.substring(extractPath.length);
				} else {
					return zipfile.readEntry();
				}
				if (targetDir) {
					fileName = path.join(targetDir, fileName);
				}
				if (isDirectoryName(fileName)) {
					fse.mkdirp(fileName, e => {
						if (e) {
							return reject(e);
						}
						zipfile.readEntry();
					});
				} else {
					zipfile.openReadStream(entry, (e, readStream) => {
						if (e || !readStream) {
							return reject(e);
						}
						// ensure parent directory exists
						fse.mkdirp(path.dirname(fileName), er => {
							if (er) {
								return reject(er);
							}
							readStream.on('end', () => {
								zipfile.readEntry();
							});
							const mode = (entry.externalFileAttributes >> 16) & 0xFFFF;
							const destSteam = fse.createWriteStream(fileName, {mode});
							readStream.pipe(destSteam);
						});
					});
				}
			});
		});
	});
}

async function extract(filename, dest) {
	await fse.mkdirp(dest);
	const extractPath = path.basename(filename, '.zip');
	await extractArchive(filename, dest, extractPath);
}

async function download() {
	await fse.mkdirp(__ELASTIC__.LOCAL_TEST_ELASTIC_PATH);
	const esDir = path.resolve(__ELASTIC__.LOCAL_TEST_ELASTIC_PATH, `es${__ELASTIC__.LOCAL_TEST_ELASTIC_VERSION}`);
	const esBin = path.resolve(__ELASTIC__.LOCAL_TEST_ELASTIC_PATH, `es${__ELASTIC__.LOCAL_TEST_ELASTIC_VERSION}`, 'bin', 'elasticsearch');
	if (!(await fse.pathExists(esBin))) {
		const downloadFilename = path.resolve(__ELASTIC__.LOCAL_TEST_ELASTIC_PATH, `elasticsearch-${__ELASTIC__.LOCAL_TEST_ELASTIC_VERSION}.zip`);
		if (!(await fse.pathExists(downloadFilename))) {
			const downloadUrl = `https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-${__ELASTIC__.LOCAL_TEST_ELASTIC_VERSION}.zip`;
			await downloadFile(downloadUrl, downloadFilename);
		}
		if (!(await fse.pathExists(esBin))) {
			await extract(downloadFilename, esDir);
		}
		if (!(await fse.pathExists(esBin))) {
			throw Error('Unzip failed');
		}
		// await fse.chmod(esBin, '0777');
	}
}

class ElasticLocal {

	constructor(version, port, localPath) {
		this.name = 'testing';
		this.version = version;
		this.port = port;
		this.localPath = path.resolve(localPath);
	}

	async startProcess(filename, datapath, logpath) {
		const args = [
			// '-d',
			'-p', 'pid',
			`-Ecluster.name=${this.name}`,
			`-Enode.name=${this.name}-node`,
			`-Ehttp.port=${this.port}`,
			`-Epath.data=${datapath}`,
			`-Epath.logs=${logpath}`
		];
		try {
			log('Starting elasticsearch', filename, args.join(' '));
			return new Promise((resolve, reject) => {
				const process = child_process.spawn(filename, args, {detached: true, shell: true}); //, {detached: true, stdio: 'ignore', shell: true});
				process.on('exit', (code, signal) => {
					log(`child process exited with code ${code} and signal ${signal}`);
				});
				process.stdout.on('data', (data) => {
					const s = `${data}`;
					if (s.includes('[testing-node] started')) {
						resolve(process);
					}
					log(s);
				});
				process.stderr.on('data', (data) => {
					console.error(`${data}`);
				});
				log('waiting for elasticsearch');
			});
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async start() {
		this.dir = tmp.dirSync();
		const esBin = path.resolve(this.localPath, `es${this.version}`, 'bin', 'elasticsearch');
		const datapath = path.resolve(this.dir.name, 'data');
		const logpath = path.resolve(this.dir.name, 'log');
		this.process = await this.startProcess(esBin, datapath, logpath);
	}

	async stop() {
		log('stopping elasticsearch');
		if (this.process) {
			process.kill(-this.process.pid);
		}
		if (this.dir) {
			this.dir.removeCallback();
		}
	}

}


async function start() {
	await download();
	const elasticInstance = new ElasticLocal(__ELASTIC__.LOCAL_TEST_ELASTIC_VERSION, __ELASTIC__.LOCAL_TEST_ELASTIC_PORT, __ELASTIC__.LOCAL_TEST_ELASTIC_PATH);
	await elasticInstance.start();
	return elasticInstance;
}

module.exports = async () => {
	global.__ELASTIC__ = await start();
};
