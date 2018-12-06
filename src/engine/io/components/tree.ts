import {Store} from '../../store/store';
import {MatchDir, MatchFile} from './match';
import * as path from 'path';
import {FileTyp} from '../../../types';
import {fillMatchTags} from './tag';

function applyLevel(dir: MatchDir, level: number) {
	dir.directories.forEach(d => {
		applyLevel(d, level + 1);
	});
	dir.level = level;
}

export async function buildMatchTreeFromDB(store: Store): Promise<Array<MatchDir>> {
	const folders = await store.folderStore.all();
	const nodes = folders.map(f => {
		const node: MatchDir = {
			name: f.path,
			rootID: f.rootID,
			stat: {ctime: f.stat.created, mtime: f.stat.modified},
			level: 0,
			parent: undefined,
			folder: f,
			files: [],
			directories: [],
			removedTracks: [],
			removedFolders: []
		};
		return node;
	});
	const roots: Array<MatchDir> = [];

	for (const node of nodes) {
		if (!node.folder) {
			return Promise.reject(Error('node folder must exist'));
		}
		const parentId = node.folder.parentID;
		if (parentId && parentId.length !== 0) {
			node.parent = nodes.find(n => !!n.folder && (n.folder.id === parentId));
			if (!node.parent) {
				return Promise.reject(Error('parent match must exist'));
			}
			node.parent.directories.push(node);
		} else {
			roots.push(node);
		}
		if (node.folder.tag.image) {
			const file: MatchFile = {
				name: path.join(node.folder.path, node.folder.tag.image),
				type: FileTyp.IMAGE,
				stat: {
					ctime: 0,
					mtime: 0,
					size: 0
				}
			};
			node.files.push(file);
		}
		const tracks = await store.trackStore.search({parentID: node.folder.id});
		tracks.forEach(t => {
			const file: MatchFile = {
				track: t,
				name: path.join(t.path, t.name),
				type: FileTyp.AUDIO,
				stat: {
					ctime: t.stat.created,
					mtime: t.stat.modified,
					size: t.stat.size
				}
			};
			node.files.push(file);
		});
	}

	roots.forEach(root => applyLevel(root, 0));
	roots.forEach(root => fillMatchTags(root));
	return roots;
}
