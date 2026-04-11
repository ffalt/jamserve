var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RootWorker_1;
import { DirScanner } from '../../../../utils/scan-dir.js';
import { ObjLoadTrackMatch, WorkerScan } from '../scan.js';
import { BaseWorker } from './base.js';
import { injectable, injectFromBase } from 'inversify';
import { WorkerMergeScan } from '../merge-scan.js';
import { ensureTrailingPathSeparator, removeTrailingPathSeparator } from '../../../../utils/fs-utils.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { logger } from '../../../../utils/logger.js';
const log = logger('RootWorker');
let RootWorker = RootWorker_1 = class RootWorker extends BaseWorker {
    static async appendRemovedIDsInBatches(fetchIDs, append) {
        let offset = 0;
        for (;;) {
            const ids = await fetchIDs(offset, RootWorker_1.REMOVE_BATCH_SIZE);
            if (ids.length === 0) {
                break;
            }
            append(ids);
            offset += ids.length;
            if (ids.length < RootWorker_1.REMOVE_BATCH_SIZE) {
                break;
            }
        }
    }
    static async validateRootPath(orm, dir, rootIdToIgnore) {
        const d = dir.trim();
        if (d.length === 0 || d.includes('*')) {
            throw new Error('Root Directory invalid');
        }
        if (!path.isAbsolute(d)) {
            throw new Error('Root Directory must be absolute');
        }
        let resolvedDir;
        try {
            resolvedDir = await fs.realpath(d);
        }
        catch {
            resolvedDir = d;
        }
        const normalizedPath = removeTrailingPathSeparator(resolvedDir);
        for (const deniedPath of RootWorker_1.DENIED_ROOT_PATHS) {
            if (normalizedPath === deniedPath || normalizedPath.startsWith(deniedPath + '/')) {
                throw new Error(`Root Directory cannot be a sensitive system path: ${deniedPath}`);
            }
        }
        const roots = (await orm.Root.all()).filter(r => r.id !== rootIdToIgnore);
        const newPath = ensureTrailingPathSeparator(path.isAbsolute(resolvedDir) ? resolvedDir : path.resolve(resolvedDir));
        for (const r of roots) {
            const existingPath = ensureTrailingPathSeparator(path.resolve(r.path));
            if (newPath === existingPath) {
                throw new Error(`Root path is already used by root '${r.name}'`);
            }
            if (newPath.startsWith(existingPath)) {
                throw new Error(`Root path '${d}' is inside an existing root '${r.name}' ('${r.path}')`);
            }
            if (existingPath.startsWith(newPath)) {
                throw new Error(`Root path '${d}' contains an existing root '${r.name}' ('${r.path}')`);
            }
        }
        return newPath;
    }
    async remove(orm, root, changes) {
        await RootWorker_1.appendRemovedIDsInBatches((offset, limit) => orm.Track.findIDs({ where: { root: root.id }, offset, limit }), ids => {
            changes.tracks.removed.appendIDs(ids);
        });
        await RootWorker_1.appendRemovedIDsInBatches((offset, limit) => orm.Folder.findIDs({ where: { root: root.id }, offset, limit }), ids => {
            changes.folders.removed.appendIDs(ids);
        });
        const folderIDs = changes.folders.removed.ids();
        for (let start = 0; start < folderIDs.length; start += RootWorker_1.REMOVE_BATCH_SIZE) {
            const folderBatch = folderIDs.slice(start, start + RootWorker_1.REMOVE_BATCH_SIZE);
            if (folderBatch.length === 0) {
                continue;
            }
            const artworkIDs = await orm.Artwork.findIDs({ where: { folder: folderBatch } });
            changes.artworks.removed.appendIDs(artworkIDs);
        }
        changes.roots.removed.add(root);
    }
    async scan(orm, root, changes) {
        const dirScanner = new DirScanner();
        const scanDir = await dirScanner.scan(root.path);
        const scanMatcher = new WorkerScan(orm, root.id, this.audioModule, this.imageModule, changes);
        const rootMatch = await scanMatcher.match(scanDir);
        const scanMerger = new WorkerMergeScan(orm, root.strategy, changes);
        await scanMerger.mergeMatch(rootMatch);
    }
    async refreshMeta(orm, root, changes) {
        const trackIDs = await orm.Track.findIDsFilter({ rootIDs: [root.id] });
        changes.tracks.updated.appendIDs(trackIDs);
        await this.scan(orm, root, changes);
    }
    async mergeChanges(orm, root, changes) {
        if (orm.em.hasChanges()) {
            await orm.em.flush();
        }
        const folders = await orm.Folder.findByIDs(changes.folders.updated.ids());
        let rootMatch;
        for (const folder of folders) {
            const parents = await this.getParents(folder);
            const parent = parents.at(0);
            if (parent) {
                if (!rootMatch) {
                    const tracks = await RootWorker_1.buildMergeTracks(parent);
                    rootMatch = { changed: true, folder: parent, path: parent.path, children: [], tracks, nrOfTracks: tracks.length };
                }
                const pathToChild = [...parents.slice(1), folder];
                await this.buildMergeNode(pathToChild, rootMatch);
            }
        }
        if (rootMatch) {
            await this.loadEmptyUnchanged(rootMatch);
            const scanMerger = new WorkerMergeScan(orm, root.strategy, changes);
            await scanMerger.merge(rootMatch);
        }
    }
    async buildMergeNode(pathToChild, merge) {
        const folder = pathToChild.at(0);
        if (!folder) {
            return;
        }
        let node = merge.children.find(c => c.folder.id === folder.id);
        if (!node) {
            const tracks = await RootWorker_1.buildMergeTracks(folder);
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
        const newPath = await RootWorker_1.validateRootPath(orm, path);
        const root = orm.Root.create({ name, path: newPath, strategy });
        await orm.Root.persistAndFlush(root);
        return root;
    }
    async update(orm, root, name, path, strategy) {
        root.name = name;
        if (root.path !== path) {
            const newPath = await RootWorker_1.validateRootPath(orm, path, root.id);
            const oldPath = ensureTrailingPathSeparator(root.path);
            root.path = newPath;
            await this.migrateRootPath(orm, root, oldPath, newPath);
        }
        root.strategy = strategy;
        orm.Root.persistLater(root);
    }
    async migrateRootPath(orm, root, oldPath, newPath) {
        log.info(`Migrating root path from ${oldPath} to ${newPath}`);
        const folders = await orm.Folder.find({ where: { root: root.id } });
        const tracks = await orm.Track.find({ where: { root: root.id } });
        const artworks = await orm.Artwork.findFilter({ folderIDs: folders.map(f => f.id) });
        let updatedFolders = 0;
        for (const folder of folders) {
            if (folder.path.startsWith(oldPath)) {
                folder.path = newPath + folder.path.slice(oldPath.length);
                orm.Folder.persistLater(folder);
                updatedFolders++;
            }
        }
        let updatedTracks = 0;
        for (const track of tracks) {
            if (track.path.startsWith(oldPath)) {
                track.path = newPath + track.path.slice(oldPath.length);
                orm.Track.persistLater(track);
                updatedTracks++;
            }
        }
        let updatedArtworks = 0;
        for (const artwork of artworks) {
            if (artwork.path.startsWith(oldPath)) {
                artwork.path = newPath + artwork.path.slice(oldPath.length);
                orm.Artwork.persistLater(artwork);
                updatedArtworks++;
            }
        }
        log.info(`Migrated ${updatedFolders} folders, ${updatedTracks} tracks, ${updatedArtworks} artworks`);
        await orm.em.flush();
    }
    async getParents(folder) {
        const parent = await folder.parent.get();
        if (!parent) {
            return [];
        }
        return [...(await this.getParents(parent)), parent];
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
        let stat = [`${' '.repeat(node?.folder.level ?? 0)}${node?.changed ? '** ' : '|- '}${node?.folder.path}`];
        for (const n of (node?.children ?? [])) {
            stat = [...stat, ...this.logNode(n)];
        }
        return stat;
    }
    static async buildMergeTracks(folder) {
        const tracks = await folder.tracks.getItems();
        const list = [];
        for (const track of tracks) {
            list.push(new ObjLoadTrackMatch(track));
        }
        return list;
    }
};
RootWorker.DENIED_ROOT_PATHS = [
    '/',
    '/bin',
    '/boot',
    '/dev',
    '/etc',
    '/lib',
    '/lib64',
    '/proc',
    '/root',
    '/run',
    '/sbin',
    '/sys',
    '/usr',
    '/var',
    '/opt',
    '/srv',
    '/root'
];
RootWorker.REMOVE_BATCH_SIZE = 1000;
RootWorker = RootWorker_1 = __decorate([
    injectable(),
    injectFromBase()
], RootWorker);
export { RootWorker };
//# sourceMappingURL=root.js.map