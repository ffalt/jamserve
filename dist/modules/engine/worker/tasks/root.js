"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootWorker = void 0;
const scan_dir_1 = require("../../../../utils/scan-dir");
const scan_1 = require("../scan");
const base_1 = require("./base");
const typescript_ioc_1 = require("typescript-ioc");
let RootWorker = class RootWorker extends base_1.BaseWorker {
    async validateRootPath(orm, dir) {
        const d = dir.trim();
        if (d[0] === '.') {
            return Promise.reject(Error('Root Directory must be absolute'));
        }
        if (d.length === 0 || d.includes('*')) {
            return Promise.reject(Error('Root Directory invalid'));
        }
        const roots = await orm.Root.all();
        for (const r of roots) {
            if (dir.startsWith(r.path) || r.path.startsWith(dir)) {
                return Promise.reject(Error('Root path already used'));
            }
        }
    }
    async remove(orm, root, changes) {
        const removedTracks = await orm.Track.find({ where: { root: root.id } });
        const removedFolders = await orm.Folder.find({ where: { root: root.id } });
        if (removedFolders.length > 0) {
            const removedArtworks = await orm.Artwork.findFilter({ folderIDs: removedFolders.map(r => r.id) });
            changes.artworks.removed.append(removedArtworks);
        }
        changes.folders.removed.append(removedFolders);
        changes.tracks.removed.append(removedTracks);
        changes.roots.removed.add(root);
    }
    async scan(orm, root, changes) {
        const dirScanner = new scan_dir_1.DirScanner();
        const scanDir = await dirScanner.scan(root.path);
        const scanMatcher = new scan_1.WorkerScan(orm, root.id, this.audioModule, this.imageModule, changes);
        await scanMatcher.match(scanDir);
    }
    async create(orm, name, path, strategy) {
        await this.validateRootPath(orm, path);
        const root = orm.Root.create({ name, path, strategy });
        await orm.Root.persistAndFlush(root);
        return root;
    }
    async update(orm, root, name, path, strategy) {
        root.name = name;
        if (root.path !== path) {
            await this.validateRootPath(orm, path);
            root.path = path;
        }
        root.strategy = strategy;
        orm.Root.persistLater(root);
    }
};
RootWorker = __decorate([
    typescript_ioc_1.InRequestScope
], RootWorker);
exports.RootWorker = RootWorker;
//# sourceMappingURL=root.js.map