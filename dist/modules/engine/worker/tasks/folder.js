"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderWorker = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fs_utils_1 = require("../../../../utils/fs-utils");
const enums_1 = require("../../../../types/enums");
const dir_name_1 = require("../../../../utils/dir-name");
const base_1 = require("./base");
class FolderWorker extends base_1.BaseWorker {
    static async validateFolderTask(destPath, destName) {
        const newPath = path_1.default.join(destPath, destName);
        const exists = await fs_extra_1.default.pathExists(newPath);
        if (exists) {
            return Promise.reject(Error('Folder name already used in Destination'));
        }
    }
    async moveFolder(folder, newParent, changes) {
        const oldParent = await folder.parent;
        if (!oldParent) {
            return Promise.reject(Error('Root folder can not be moved'));
        }
        if (oldParent.id === newParent.id) {
            return Promise.reject(Error('Folder name already used in Destination'));
        }
        const p = newParent.path;
        const name = path_1.default.basename(folder.path);
        const newPath = path_1.default.join(p, name);
        await FolderWorker.validateFolderTask(p, name);
        try {
            await fs_extra_1.default.move(folder.path, newPath);
        }
        catch (e) {
            return Promise.reject(Error('Folder moving failed'));
        }
        await this.updateFolder(folder, newParent, newPath, changes);
    }
    async updateFolder(folder, newParent, newPath, changes) {
        const source = fs_utils_1.ensureTrailingPathSeparator(folder.path);
        const folders = await this.orm.Folder.findAllDescendants(folder);
        folder.parent = newParent;
        folder.root = newParent.root;
        this.orm.orm.em.persistLater(folder);
        const dest = fs_utils_1.ensureTrailingPathSeparator(newPath);
        for (const sub of folders) {
            sub.path = sub.path.replace(source, dest);
            sub.root = newParent.root;
            changes.folders.updated.add(sub);
            this.orm.orm.em.persistLater(sub);
            const tracks = await sub.tracks;
            for (const track of tracks) {
                track.path = track.path.replace(source, dest);
                track.root = newParent.root;
                changes.tracks.updated.add(track);
                this.orm.orm.em.persistLater(track);
            }
            const artworks = await sub.artworks;
            for (const artwork of artworks) {
                artwork.path = artwork.path.replace(source, dest);
                changes.artworks.updated.add(artwork);
                this.orm.orm.em.persistLater(artwork);
            }
        }
    }
    async create(parentID, name, root, changes) {
        const parent = await this.orm.Folder.findOne(parentID);
        if (!parent) {
            return Promise.reject(Error('Destination Folder not found'));
        }
        name = await dir_name_1.validateFolderName(name);
        const parentPath = fs_utils_1.ensureTrailingPathSeparator(parent.path);
        const destination = fs_utils_1.ensureTrailingPathSeparator(path_1.default.join(parentPath, name));
        await FolderWorker.validateFolderTask(parent.path, name);
        await fs_extra_1.default.mkdir(destination);
        const { title, year } = dir_name_1.splitDirectoryName(name);
        const stat = await fs_extra_1.default.stat(destination);
        const folder = this.orm.Folder.create({
            name,
            path: destination,
            folderType: enums_1.FolderType.extras,
            level: parent.level + 1,
            parent, root, title, year,
            statCreated: stat.ctime.valueOf(),
            statModified: stat.mtime.valueOf()
        });
        this.orm.Folder.persistLater(folder);
        changes.folders.added.add(folder);
        changes.folders.updated.add(parent);
    }
    async delete(root, folderIDs, changes) {
        const folders = await this.orm.Folder.find(folderIDs);
        const trashPath = path_1.default.join(root.path, '.trash');
        for (const folder of folders) {
            if (folder.level === 0) {
                return Promise.reject(Error('Root folder can not be deleted'));
            }
            try {
                await fs_extra_1.default.move(folder.path, path_1.default.join(trashPath, `${Date.now()}_${path_1.default.basename(folder.path)}`));
            }
            catch (e) {
                return Promise.reject(Error('Folder removing failed'));
            }
            const folders = await this.orm.Folder.findAllDescendants(folder);
            changes.folders.removed.append(folders);
            const tracks = await this.orm.Track.findFilter({ childOfID: folder.id });
            changes.tracks.removed.append(tracks);
            const artworks = await this.orm.Artwork.findFilter({ childOfID: folder.id });
            changes.artworks.removed.append(artworks);
            if (folder.parent) {
                changes.folders.updated.add(folder.parent);
            }
            changes.folders.removed.add(folder);
        }
    }
    async rename(folderID, newName, changes) {
        const folder = await this.orm.Folder.findOne(folderID);
        if (!folder) {
            return Promise.reject(Error('Folder not found'));
        }
        const name = await dir_name_1.validateFolderName(newName);
        const oldPath = fs_utils_1.ensureTrailingPathSeparator(folder.path);
        const p = path_1.default.dirname(folder.path);
        const newPath = path_1.default.join(p, name);
        await FolderWorker.validateFolderTask(p, name);
        try {
            await fs_extra_1.default.rename(oldPath, newPath);
        }
        catch (e) {
            return Promise.reject(Error('Folder renaming failed'));
        }
        const folders = await this.orm.Folder.findAllDescendants(folder);
        const dest = fs_utils_1.ensureTrailingPathSeparator(newPath);
        for (const child of folders) {
            child.path = child.path.replace(oldPath, dest);
            changes.folders.updated.add(child);
            this.orm.orm.em.persistLater(child);
            const tracks = child.tracks.getItems();
            for (const track of tracks) {
                track.path = track.path.replace(oldPath, dest);
                changes.tracks.updated.add(track);
                this.orm.orm.em.persistLater(track);
            }
            const artworks = child.artworks;
            for (const artwork of artworks) {
                artwork.path = artwork.path.replace(oldPath, dest);
                changes.artworks.updated.add(artwork);
                this.orm.orm.em.persistLater(artwork);
            }
        }
    }
    async move(newParentID, moveFolderIDs, changes) {
        const newParent = await this.orm.Folder.findOne(newParentID);
        if (!newParent) {
            return Promise.reject(Error('Destination Folder not found'));
        }
        if (moveFolderIDs.includes(newParentID)) {
            return Promise.reject(Error('Folder cannot be moved to itself'));
        }
        changes.folders.updated.add(newParent);
        for (const id of moveFolderIDs) {
            const folder = await this.orm.Folder.findOne(id);
            if (!folder) {
                return Promise.reject(Error('Source Folder not found'));
            }
            if (folder.parent) {
                changes.folders.updated.add(folder.parent);
            }
            await this.moveFolder(folder, newParent, changes);
        }
    }
    async refresh(folderIDs, changes) {
        for (const id of folderIDs) {
            const folder = await this.orm.Folder.findOne(id);
            if (!folder) {
                return Promise.reject(Error('Folder not found'));
            }
            changes.folders.updated.add(folder);
        }
    }
}
exports.FolderWorker = FolderWorker;
//# sourceMappingURL=folder.js.map