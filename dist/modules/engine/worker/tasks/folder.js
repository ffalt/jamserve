"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FolderWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderWorker = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fs_utils_1 = require("../../../../utils/fs-utils");
const enums_1 = require("../../../../types/enums");
const dir_name_1 = require("../../../../utils/dir-name");
const base_1 = require("./base");
const typescript_ioc_1 = require("typescript-ioc");
let FolderWorker = FolderWorker_1 = class FolderWorker extends base_1.BaseWorker {
    static async validateFolderTask(destPath, destName) {
        const newPath = path_1.default.join(destPath, destName);
        const exists = await fs_extra_1.default.pathExists(newPath);
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
        const name = path_1.default.basename(folder.path);
        const newPath = path_1.default.join(p, name);
        await FolderWorker_1.validateFolderTask(p, name);
        try {
            await fs_extra_1.default.move(folder.path, newPath);
        }
        catch (e) {
            return Promise.reject(Error('Folder moving failed'));
        }
        await this.updateFolder(orm, folder, newParent, newPath, changes);
    }
    async updateFolder(orm, folder, newParent, newPath, changes) {
        const source = fs_utils_1.ensureTrailingPathSeparator(folder.path);
        const folders = await orm.Folder.findAllDescendants(folder);
        await folder.parent.set(newParent);
        await folder.root.set(await newParent.root.getOrFail());
        orm.Folder.persistLater(folder);
        const dest = fs_utils_1.ensureTrailingPathSeparator(newPath);
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
        name = await dir_name_1.validateFolderName(name);
        const parentPath = fs_utils_1.ensureTrailingPathSeparator(parent.path);
        const destination = fs_utils_1.ensureTrailingPathSeparator(path_1.default.join(parentPath, name));
        await FolderWorker_1.validateFolderTask(parent.path, name);
        await fs_extra_1.default.mkdir(destination);
        const { title, year } = dir_name_1.splitDirectoryName(name);
        const stat = await fs_extra_1.default.stat(destination);
        const folder = orm.Folder.create({
            name,
            path: destination,
            folderType: enums_1.FolderType.extras,
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
        const name = await dir_name_1.validateFolderName(newName);
        const oldPath = fs_utils_1.ensureTrailingPathSeparator(folder.path);
        const p = path_1.default.dirname(folder.path);
        const newPath = path_1.default.join(p, name);
        await FolderWorker_1.validateFolderTask(p, name);
        try {
            await fs_extra_1.default.rename(oldPath, newPath);
        }
        catch (e) {
            return Promise.reject(Error('Folder renaming failed'));
        }
        const folders = await orm.Folder.findAllDescendants(folder);
        const dest = fs_utils_1.ensureTrailingPathSeparator(newPath);
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
    typescript_ioc_1.InRequestScope
], FolderWorker);
exports.FolderWorker = FolderWorker;
//# sourceMappingURL=folder.js.map