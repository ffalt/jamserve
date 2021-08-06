var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FolderWorker_1;
import fse from 'fs-extra';
import path from 'path';
import { ensureTrailingPathSeparator } from '../../../../utils/fs-utils';
import { FolderType } from '../../../../types/enums';
import { splitDirectoryName, validateFolderName } from '../../../../utils/dir-name';
import { BaseWorker } from './base';
import { InRequestScope } from 'typescript-ioc';
let FolderWorker = FolderWorker_1 = class FolderWorker extends BaseWorker {
    static async validateFolderTask(destPath, destName) {
        const newPath = path.join(destPath, destName);
        const exists = await fse.pathExists(newPath);
        if (exists) {
            return Promise.reject(Error('Folder name already used in Destination'));
        }
    }
    async moveFolder(orm, folder, newParent, changes) {
        const oldParent = await folder.parent.get();
        if (!oldParent) {
            return Promise.reject(Error('Root folder can not be moved'));
        }
        if (oldParent.id === newParent.id) {
            return Promise.reject(Error('Folder name already used in Destination'));
        }
        const p = newParent.path;
        const name = path.basename(folder.path);
        const newPath = path.join(p, name);
        await FolderWorker_1.validateFolderTask(p, name);
        try {
            await fse.move(folder.path, newPath);
        }
        catch (e) {
            return Promise.reject(Error('Folder moving failed'));
        }
        await FolderWorker_1.updateFolder(orm, folder, newParent, newPath, changes);
    }
    static async updateFolder(orm, folder, newParent, newPath, changes) {
        const source = ensureTrailingPathSeparator(folder.path);
        const folders = await orm.Folder.findAllDescendants(folder);
        await folder.parent.set(newParent);
        await folder.root.set(await newParent.root.getOrFail());
        orm.Folder.persistLater(folder);
        const dest = ensureTrailingPathSeparator(newPath);
        for (const sub of folders) {
            sub.path = sub.path.replace(source, dest);
            sub.root = newParent.root;
            changes.folders.updated.add(sub);
            orm.Folder.persistLater(sub);
            const tracks = await sub.tracks.getItems();
            for (const track of tracks) {
                track.path = track.path.replace(source, dest);
                track.root = newParent.root;
                changes.tracks.updated.add(track);
                orm.Track.persistLater(track);
            }
            const artworks = await sub.artworks.getItems();
            for (const artwork of artworks) {
                artwork.path = artwork.path.replace(source, dest);
                changes.artworks.updated.add(artwork);
                orm.Artwork.persistLater(artwork);
            }
        }
    }
    async create(orm, parentID, name, root, changes) {
        const parent = await orm.Folder.findOneByID(parentID);
        if (!parent) {
            return Promise.reject(Error('Destination Folder not found'));
        }
        name = await validateFolderName(name);
        const parentPath = ensureTrailingPathSeparator(parent.path);
        const destination = ensureTrailingPathSeparator(path.join(parentPath, name));
        await FolderWorker_1.validateFolderTask(parent.path, name);
        await fse.mkdir(destination);
        const { title, year } = splitDirectoryName(name);
        const stat = await fse.stat(destination);
        const folder = orm.Folder.create({
            name,
            path: destination,
            folderType: FolderType.extras,
            level: parent.level + 1,
            title: name !== title ? title : undefined,
            year,
            statCreated: stat.ctime,
            statModified: stat.mtime
        });
        await folder.parent.set(parent);
        await folder.root.set(root);
        orm.Folder.persistLater(folder);
        changes.folders.added.add(folder);
        changes.folders.updated.add(parent);
    }
    async delete(orm, root, folderIDs, changes) {
        const folders = await orm.Folder.findByIDs(folderIDs);
        const trashPath = path.join(root.path, '.trash');
        for (const folder of folders) {
            if (folder.level === 0) {
                return Promise.reject(Error('Root folder can not be deleted'));
            }
            try {
                await fse.move(folder.path, path.join(trashPath, `${Date.now()}_${path.basename(folder.path)}`));
            }
            catch (e) {
                return Promise.reject(Error('Folder removing failed'));
            }
            const folders = await orm.Folder.findAllDescendants(folder);
            changes.folders.removed.append(folders);
            const tracks = await orm.Track.findFilter({ childOfID: folder.id });
            changes.tracks.removed.append(tracks);
            const artworks = await orm.Artwork.findFilter({ childOfID: folder.id });
            changes.artworks.removed.append(artworks);
            const parent = await folder.parent.get();
            if (parent) {
                changes.folders.updated.add(parent);
            }
            changes.folders.removed.add(folder);
        }
    }
    async rename(orm, folderID, newName, changes) {
        const folder = await orm.Folder.findOneByID(folderID);
        if (!folder) {
            return Promise.reject(Error('Folder not found'));
        }
        const name = await validateFolderName(newName);
        const oldPath = ensureTrailingPathSeparator(folder.path);
        const p = path.dirname(folder.path);
        const newPath = path.join(p, name);
        await FolderWorker_1.validateFolderTask(p, name);
        try {
            await fse.rename(oldPath, newPath);
        }
        catch (e) {
            return Promise.reject(Error('Folder renaming failed'));
        }
        const folders = await orm.Folder.findAllDescendants(folder);
        const dest = ensureTrailingPathSeparator(newPath);
        for (const item of folders) {
            item.path = item.path.replace(oldPath, dest);
            changes.folders.updated.add(item);
            orm.Folder.persistLater(item);
            const tracks = await item.tracks.getItems();
            for (const track of tracks) {
                track.path = track.path.replace(oldPath, dest);
                changes.tracks.updated.add(track);
                orm.Track.persistLater(track);
            }
            const artworks = await item.artworks.getItems();
            for (const artwork of artworks) {
                artwork.path = artwork.path.replace(oldPath, dest);
                changes.artworks.updated.add(artwork);
                orm.Artwork.persistLater(artwork);
            }
        }
    }
    async move(orm, newParentID, moveFolderIDs, changes) {
        const newParent = await orm.Folder.findOneByID(newParentID);
        if (!newParent) {
            return Promise.reject(Error('Destination Folder not found'));
        }
        if (moveFolderIDs.includes(newParentID)) {
            return Promise.reject(Error('Folder cannot be moved to itself'));
        }
        changes.folders.updated.add(newParent);
        for (const id of moveFolderIDs) {
            const folder = await orm.Folder.findOneOrFailByID(id);
            const parent = await folder.parent.get();
            if (parent) {
                changes.folders.updated.add(parent);
            }
            await this.moveFolder(orm, folder, newParent, changes);
        }
    }
    async refresh(orm, folderIDs, changes) {
        for (const id of folderIDs) {
            const folder = await orm.Folder.findOneOrFailByID(id);
            changes.folders.updated.add(folder);
        }
    }
};
FolderWorker = FolderWorker_1 = __decorate([
    InRequestScope
], FolderWorker);
export { FolderWorker };
//# sourceMappingURL=folder.js.map