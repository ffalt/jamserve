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
var ArtworkWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtworkWorker = exports.FolderTypeImageName = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fs_utils_1 = require("../../../../utils/fs-utils");
const artwork_type_1 = require("../../../../utils/artwork-type");
const base_1 = require("./base");
const typescript_ioc_1 = require("typescript-ioc");
exports.FolderTypeImageName = {
    unknown: 'folder',
    artist: 'artist',
    collection: 'folder',
    album: 'cover',
    multialbum: 'cover',
    extras: 'folder'
};
let ArtworkWorker = ArtworkWorker_1 = class ArtworkWorker extends base_1.BaseWorker {
    async updateArtworkImageFile(artwork) {
        const destFile = path_1.default.join(artwork.path, artwork.name);
        const stat = await fs_extra_1.default.stat(destFile);
        const info = await this.imageModule.getImageInfo(destFile);
        artwork.types = artwork_type_1.artWorkImageNameToType(artwork.name);
        artwork.statCreated = stat.ctime;
        artwork.statModified = stat.mtime;
        artwork.fileSize = stat.size;
        artwork.format = info?.format;
        artwork.height = info?.height;
        artwork.width = info?.width;
    }
    async rename(orm, artworkID, newName, changes) {
        const artwork = await orm.Artwork.findOneByID(artworkID);
        if (!artwork) {
            return Promise.reject(Error(`Artwork not found`));
        }
        artwork.name = await this.renameFile(artwork.path, artwork.name, newName);
        await this.updateArtworkImageFile(artwork);
        orm.Artwork.persistLater(artwork);
        changes.artworks.updated.add(artwork);
        changes.folders.updated.add(await artwork.folder.get());
    }
    static getArtworkName(folder, types) {
        let name = types.sort((a, b) => a.localeCompare(b)).join('-');
        if (!name) {
            name = exports.FolderTypeImageName[folder.folderType];
        }
        return name;
    }
    async getArtworkFilenameUnique(folder, importFilename, types) {
        const name = ArtworkWorker_1.getArtworkName(folder, types);
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
    async create(orm, folderID, artworkFilename, types, changes) {
        if (!artworkFilename || !(await fs_extra_1.default.pathExists(artworkFilename))) {
            return Promise.reject(Error('Invalid Artwork File Name'));
        }
        const folder = await orm.Folder.findOneByID(folderID);
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
        const artwork = orm.Artwork.create({
            name: dest,
            path: folder.path,
            types
        });
        await artwork.folder.set(folder);
        changes.folders.updated.add(folder);
        changes.artworks.added.add(artwork);
        await this.updateArtworkImageFile(artwork);
        orm.Artwork.persistLater(artwork);
    }
    async replace(orm, artworkID, artworkFilename, changes) {
        if (!artworkFilename || !(await fs_extra_1.default.pathExists(artworkFilename))) {
            return Promise.reject(Error('Invalid Artwork File Name'));
        }
        const artwork = await orm.Artwork.findOneByID(artworkID);
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
        orm.Artwork.persistLater(artwork);
    }
    async download(orm, folderID, artworkURL, types, changes) {
        const folder = await orm.Folder.findOneOrFailByID(folderID);
        const name = types.sort((a, b) => a.localeCompare(b)).join('-');
        const filename = await this.imageModule.storeImage(folder.path, name, artworkURL);
        const artwork = orm.Artwork.create({ name: filename, path: folder.path });
        await artwork.folder.set(folder);
        changes.folders.updated.add(folder);
        changes.artworks.added.add(artwork);
        await this.updateArtworkImageFile(artwork);
        orm.Artwork.persistLater(artwork);
    }
    async remove(orm, root, artworkID, changes) {
        const artwork = await orm.Artwork.findOneByID(artworkID);
        if (!artwork) {
            return Promise.reject(Error(`Artwork not found`));
        }
        await this.moveToTrash(root, artwork.path, artwork.name);
        changes.artworks.removed.add(artwork);
        changes.folders.updated.add(await artwork.folder.get());
    }
    async move(orm, artworkIDs, newParentID, changes) {
        const artworks = await orm.Artwork.findByIDs(artworkIDs);
        if (artworks.length !== artworkIDs.length) {
            return Promise.reject(Error('Artwork not found'));
        }
        const newParent = await orm.Folder.findOneByID(newParentID);
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
            const oldParent = await artwork.folder.get();
            if (oldParent?.id !== newParentID) {
                changes.folders.updated.add(oldParent);
                await fs_extra_1.default.move(path_1.default.join(artwork.path, artwork.name), path_1.default.join(newParent.path, artwork.name));
                artwork.path = fs_utils_1.ensureTrailingPathSeparator(newParent.path);
                await artwork.folder.set(newParent);
                orm.Artwork.persistLater(artwork);
            }
        }
    }
};
ArtworkWorker = ArtworkWorker_1 = __decorate([
    typescript_ioc_1.InRequestScope
], ArtworkWorker);
exports.ArtworkWorker = ArtworkWorker;
//# sourceMappingURL=artwork.js.map