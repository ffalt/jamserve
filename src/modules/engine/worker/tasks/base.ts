import { containsFolderSystemChars, fileExt, replaceFolderSystemChars } from '../../../../utils/fs-utils.js';
import path from 'node:path';
import fse from 'fs-extra';
import { ImageModule } from '../../../image/image.module.js';
import { AudioModule } from '../../../audio/audio.module.js';
import { Root } from '../../../../entity/root/root.js';
import { Inject } from 'typescript-ioc';

export class BaseWorker {
	@Inject
	protected audioModule!: AudioModule;

	@Inject
	protected imageModule!: ImageModule;

	async renameFile(dir: string, oldName: string, newName: string): Promise<string> {
		if (containsFolderSystemChars(newName)) {
			return Promise.reject(new Error('Invalid Name'));
		}
		const name = replaceFolderSystemChars(newName, '').trim();
		const ext = fileExt(name);
		const basename = path.basename(name, ext);
		if (basename.length === 0) {
			return Promise.reject(new Error('Invalid Name'));
		}
		const ext2 = fileExt(oldName);
		if (ext !== ext2) {
			return Promise.reject(new Error(`Changing File extension not supported "${ext2}"=>"${ext}"`));
		}
		const newPath = path.join(dir, name);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(new Error('File name already used in Destination'));
		}
		try {
			await fse.rename(path.join(dir, oldName), newPath);
		} catch {
			return Promise.reject(new Error('File renaming failed'));
		}
		return name;
	}

	async moveToTrash(root: Root, dir: string, name: string): Promise<void> {
		try {
			await fse.move(path.join(dir, name), path.join(root.path, '.trash', `${Date.now()}_${name}`));
		} catch {
			return Promise.reject(new Error('Moving to Trash failed'));
		}
	}
}
