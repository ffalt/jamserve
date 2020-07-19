"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtworkWorker = exports.FolderTypeImageName = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fs_utils_1 = require("../../../../utils/fs-utils");
const artwork_type_1 = require("../../../../utils/artwork-type");
const base_1 = require("./base");
exports.FolderTypeImageName = {
    unknown: 'folder',
    artist: 'artist',
    collection: 'folder',
    album: 'cover',
    multialbum: 'cover',
    extras: 'folder'
};
class ArtworkWorker extends base_1.BaseWorker {
    async updateArtworkImageFile(artwork) {
        const destFile = path_1.default.join(artwork.path, artwork.name);
        const stat = await fs_extra_1.default.stat(destFile);
        const info = await this.imageModule.getImageInfo(destFile);
        artwork.types = artwork_type_1.artWorkImageNameToType(artwork.name);
        artwork.statCreated = stat.ctime.valueOf();
        artwork.statModified = stat.mtime.valueOf();
        artwork.fileSize = stat.size;
        artwork.format = info === null || info === void 0 ? void 0 : info.format;
        artwork.height = info === null || info === void 0 ? void 0 : info.height;
        artwork.width = info === null || info === void 0 ? void 0 : info.width;
    }
    async rename(artworkID, newName, changes) {
        const artwork = await this.orm.Artwork.findOne(artworkID);
        if (!artwork) {
            return Promise.reject(Error(`Artwork not found`));
        }
        artwork.name = await this.renameFile(artwork.path, artwork.name, newName);
        await this.updateArtworkImageFile(artwork);
        this.orm.orm.em.persistLater(artwork);
        changes.artworks.updated.add(artwork);
        changes.folders.updated.add(artwork.folder);
    }
    getArtworkName(folder, types) {
        let name = types.sort((a, b) => a.localeCompare(b)).join('-');
        if (!name) {
            name = exports.FolderTypeImageName[folder.folderType];
        }
        return name;
    }
    async getArtworkFilenameUnique(folder, importFilename, types) {
        const name = this.getArtworkName(folder, types);
        let suffix = fs_utils_1.fileSuffix(importFilename);
        if (suffix.length === 0) {
            const info = await this.imageModule.getImageInfo(importFilename);
            suffix = info.format;
        }
        if (!suffix || suffix.length === 0 || suffix === 'invalid') {
            return Promise.reject(Error('Image Format invalid/not known'));
        }
        let dest = `${name}.${suffix}`;
        let nr = 2;
        while (await fs_extra_1.default.pathExists(path_1.default.join(folder.path, dest))) {
            dest = `${name}-${nr}.${suffix}`;
            nr++;
        }
        return dest;
    }
    async create(folderID, artworkFilename, types, changes) {
        if (!artworkFilename || !(await fs_extra_1.default.pathExists(artworkFilename))) {
            return Promise.reject(Error('Invalid Artwork File Name'));
        }
        const folder = await this.orm.Folder.findOne(folderID);
        if (!folder) {
            return Promise.reject(Error(`Folder not found`));
        }
        const dest = await this.getArtworkFilenameUnique(folder, artworkFilename, types);
        const destFile = path_1.default.join(folder.path, dest);
        try {
            await fs_extra_1.default.copy(artworkFilename, destFile);
        }
        catch (e) {
            return Promise.reject(Error(`Importing artwork failed`));
        }
        const artwork = this.orm.Artwork.create({
            name: dest,
            path: folder.path,
            types,
            folder
        });
        changes.folders.updated.add(folder);
        changes.artworks.added.add(artwork);
        await this.updateArtworkImageFile(artwork);
        this.orm.orm.em.persistLater(artwork);
    }
    async replace(artworkID, artworkFilename, changes) {
        if (!artworkFilename || !(await fs_extra_1.default.pathExists(artworkFilename))) {
            return Promise.reject(Error('Invalid Artwork File Name'));
        }
        const artwork = await this.orm.Artwork.findOne(artworkID);
        if (!artwork) {
            return Promise.reject(Error(`Artwork not found`));
        }
        const name = fs_utils_1.basenameStripExt(artwork.name);
        const info = await this.imageModule.getImageInfo(artworkFilename);
        const suffix = info.format;
        if (!suffix || suffix.length === 0 || suffix === 'invalid') {
            return Promise.reject(Error('Image Format invalid/not known'));
        }
        await fs_utils_1.fileDeleteIfExists(path_1.default.join(artwork.path, artwork.name));
        artwork.name = `${name}.${suffix}`;
        try {
            await fs_extra_1.default.copy(artworkFilename, path_1.default.join(artwork.path, artwork.name));
        }
        catch (e) {
            return Promise.reject(Error(`Importing artwork failed`));
        }
        await this.updateArtworkImageFile(artwork);
        changes.artworks.updated.add(artwork);
        this.orm.orm.em.persistLater(artwork);
    }
    async download(folderID, artworkURL, types, changes) {
        const folder = await this.orm.Folder.findOne(folderID);
        if (!folder) {
            return Promise.reject(Error(`Folder not found`));
        }
        const name = types.sort((a, b) => a.localeCompare(b)).join('-');
        const filename = await this.imageModule.storeImage(folder.path, name, artworkURL);
        const artwork = this.orm.Artwork.create({ name: filename, path: folder.path, folder });
        changes.folders.updated.add(folder);
        changes.artworks.added.add(artwork);
        await this.updateArtworkImageFile(artwork);
        this.orm.orm.em.persistLater(artwork);
    }
    async remove(root, artworkID, changes) {
        const artwork = await this.orm.Artwork.findOne(artworkID);
        if (!artwork) {
            return Promise.reject(Error(`Artwork not found`));
        }
        await this.moveToTrash(root, artwork.path, artwork.name);
        changes.artworks.removed.add(artwork);
        changes.folders.updated.add(artwork.folder);
    }
    async move(artworkIDs, newParentID, changes) {
        const artworks = await this.orm.Artwork.find(artworkIDs);
        if (artworks.length !== artworkIDs.length) {
            return Promise.reject(Error('Artwork not found'));
        }
        const newParent = await this.orm.Folder.findOne(newParentID);
        if (!newParent) {
            return Promise.reject(Error('Destination Folder not found'));
        }
        for (const artwork of artworks) {
            if (await fs_extra_1.default.pathExists(path_1.default.join(newParent.path, artwork.name))) {
                return Promise.reject(Error('File name is already used in folder'));
            }
        }
        changes.folders.updated.add(newParent);
        for (const artwork of artworks) {
            changes.artworks.updated.add(artwork);
            const oldParent = artwork.folder;
            if (oldParent.id !== newParentID) {
                changes.folders.updated.add(oldParent);
                await fs_extra_1.default.move(path_1.default.join(artwork.path, artwork.name), path_1.default.join(newParent.path, artwork.name));
                artwork.path = fs_utils_1.ensureTrailingPathSeparator(newParent.path);
                artwork.folder = newParent;
                this.orm.orm.em.persistLater(artwork);
            }
        }
    }
}
exports.ArtworkWorker = ArtworkWorker;
//# sourceMappingURL=artwork.js.map