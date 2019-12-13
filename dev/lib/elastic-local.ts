import childProcess, {ChildProcess} from 'child_process';
import fse from 'fs-extra';
import path from 'path';
import tmp from 'tmp';
import yauzl from 'yauzl';
import {downloadFile} from '../../src/utils/download';

function isDirectoryName(s: string): boolean {
	return /\/$/.test(s);
}

export class ElasticLocal {
	private name = 'testing';
	private localPath: string;
	private process: ChildProcess | undefined;
	private dir: tmp.DirResult | undefined;

	constructor(public version: string, public port: number, localPath: string) {
		this.localPath = path.resolve(localPath);
	}

	private async extract(filename: string, dest: string): Promise<void> {
		await fse.mkdirp(dest);
		const extractPath = path.basename(filename, '.zip');
		await this.extractArchive(filename, dest, extractPath);
	}

	extractArchive(archive: string, targetDir: string, extractPath: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
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

	async startProcess(filename: string, datapath: string, logpath: string): Promise<ChildProcess> {
		const args: Array<string> = [
			'-d', '-p', 'pid',
			`-Ecluster.name=${this.name}`,
			`-Enode.name=${this.name}-node`,
			`-Ehttp.port=${this.port}`,
			`-Epath.data=${datapath}`,
			`-Epath.logs=${logpath}`
		];
		try {
			const process = childProcess.spawn(filename, args, {detached: true, stdio: 'ignore', shell: true});
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(process);
				}, 10);
			});
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async start(): Promise<void> {
		this.dir = tmp.dirSync();
		await fse.mkdirp(this.localPath);
		const esDir = path.resolve(this.localPath, `es${this.version}`);
		const esBin = path.resolve(this.localPath, `es${this.version}`, 'bin', 'elasticsearch');
		if (!(await fse.pathExists(esBin))) {
			const downloadFilename = path.resolve(this.localPath, `elasticsearch-${this.version}.zip`);
			if (!(await fse.pathExists(downloadFilename))) {
				const downloadUrl = `https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-${this.version}-windows-x86_64.zip`;
				await downloadFile(downloadUrl, downloadFilename);
			}
			if (!(await fse.pathExists(esBin))) {
				await this.extract(downloadFilename, esDir);
			}
			if (!(await fse.pathExists(esBin))) {
				return Promise.reject(Error('Unzip failed'));
			}
			// await fse.chmod(esBin, '0777');
		}
		const datapath = path.resolve(this.dir.name, 'data');
		const logpath = path.resolve(this.dir.name, 'log');
		this.process = await this.startProcess(esBin, datapath, logpath);
	}

	async stop(): Promise<void> {
		if (this.process) {
			process.kill(-this.process.pid);
		}
		if (this.dir) {
			this.dir.removeCallback();
		}
	}

}
