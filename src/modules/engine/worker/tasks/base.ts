import { containsFolderSystemChars, fileExtension, replaceFolderSystemChars } from '../../../../utils/fs-utils.js';
import path from 'node:path';
import fse from 'fs-extra';
import { ImageModule } from '../../../image/image.module.js';
import { AudioModule } from '../../../audio/audio.module.js';
import { Root } from '../../../../entity/root/root.js';
import { Folder } from '../../../../entity/folder/folder.js';
import { Orm } from '../../services/orm.service.js';
import { logger } from '../../../../utils/logger.js';
import { errorToString } from '../../../../utils/error.js';
import { injectable, inject } from 'inversify';

const log = logger('Worker');

@injectable()
export class BaseWorker {
	@inject(AudioModule)
	protected audioModule!: AudioModule;

	@inject(ImageModule)
	protected imageModule!: ImageModule;

	async refreshFolderStats(orm: Orm, folders: Array<Folder | undefined>): Promise<void> {
		const done = new Set<string>();
		for (const folder of folders) {
			if (!folder || done.has(folder.id)) {
				continue;
			}
			done.add(folder.id);
			try {
				const stat = await fse.stat(folder.path);
				folder.statCreated = stat.ctime;
				folder.statModified = stat.mtime;
				orm.Folder.persistLater(folder);
			} catch (error: unknown) {
				log.debug(`Updating folder dates failed: ${folder.path}`, errorToString(error));
			}
		}
	}

	async renameFile(dir: string, oldName: string, newName: string): Promise<string> {
		if (containsFolderSystemChars(newName) || newName.trim().length === 0) {
			return Promise.reject(new Error('Invalid Name'));
		}
		const extension2 = fileExtension(oldName);
		const rawName = replaceFolderSystemChars(newName, '').trim();
		if (['.', '..'].includes(rawName)) {
			return Promise.reject(new Error('Invalid Name'));
		}
		const name = fileExtension(rawName) ? rawName : rawName + extension2;
		const extension = fileExtension(name);
		const basename = path.basename(name, extension);
		if (basename.length === 0) {
			return Promise.reject(new Error('Invalid Name'));
		}
		if (extension !== extension2) {
			return Promise.reject(new Error(`Changing File extension not supported "${extension2}"=>"${extension}"`));
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
