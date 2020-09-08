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
const merge_scan_1 = require("../merge-scan");
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
        const rootMatch = await scanMatcher.match(scanDir);
        const scanMerger = new merge_scan_1.WorkerMergeScan(orm, root.strategy, changes);
        await scanMerger.mergeMatch(rootMatch);
    }
    async mergeChanges(orm, root, changes) {
        if (orm.em.hasChanges()) {
            await orm.em.flush();
        }
        const folders = await orm.Folder.findByIDs(changes.folders.updated.ids());
        let rootMatch;
        for (const folder of folders) {
            const parents = await this.getParents(folder);
            if (parents[0]) {
                if (!rootMatch) {
                    const tracks = await this.buildMergeTracks(parents[0]);
                    rootMatch = { changed: true, folder: parents[0], path: parents[0].path, children: [], tracks, nrOfTracks: tracks.length };
                }
                const pathToChild = parents.slice(1).concat([folder]);
                await this.buildMergeNode(pathToChild, rootMatch);
            }
        }
        if (rootMatch) {
            await this.loadEmptyUnchanged(rootMatch);
            const scanMerger = new merge_scan_1.WorkerMergeScan(orm, root.strategy, changes);
            await scanMerger.merge(rootMatch);
        }
    }
    async buildMergeNode(pathToChild, merge) {
        const folder = pathToChild[0];
        let node = merge.children.find(c => c.folder.id === folder.id);
        if (!node) {
            const tracks = await this.buildMergeTracks(folder);
            node = {
                changed: true,
                folder,
                path: folder.path,
                children: [],
                tracks,
                nrOfTracks: tracks.length
            };
            merge.children.push(node);
        }
        if (pathToChild.length > 1) {
            await this.buildMergeNode(pathToChild.slice(1), node);
        }
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
    async getParents(folder) {
        const parent = await folder.parent.get();
        if (!parent) {
            return [];
        }
        return (await this.getParents(parent)).concat([parent]);
    }
    async loadEmptyUnchanged(node) {
        const folders = await node.folder.children.getItems();
        for (const folder of folders) {
            const child = node.children.find(f => f.folder.id === folder.id);
            if (child) {
                await this.loadEmptyUnchanged(child);
            }
            else {
                node.children.push({
                    changed: false,
                    folder,
                    path: folder.path,
                    children: [],
                    nrOfTracks: await folder.tracks.count(),
                    tracks: []
                });
            }
        }
    }
    logNode(node) {
        var _a, _b;
        let stat = [' '.repeat(((_a = node === null || node === void 0 ? void 0 : node.folder) === null || _a === void 0 ? void 0 : _a.level) || 0) + ((node === null || node === void 0 ? void 0 : node.changed) ? '** ' : '|- ') + ((_b = node === null || node === void 0 ? void 0 : node.folder) === null || _b === void 0 ? void 0 : _b.path)];
        ((node === null || node === void 0 ? void 0 : node.children) || []).forEach(n => {
            stat = stat.concat(this.logNode(n));
        });
        return stat;
    }
    async buildMergeTracks(folder) {
        const tracks = await folder.tracks.getItems();
        const list = [];
        for (const track of tracks) {
            list.push(new scan_1.ObjLoadTrackMatch(track));
        }
        return list;
    }
};
RootWorker = __decorate([
    typescript_ioc_1.InRequestScope
], RootWorker);
exports.RootWorker = RootWorker;
//# sourceMappingURL=root.js.map