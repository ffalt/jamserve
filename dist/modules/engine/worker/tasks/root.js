"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootWorker = void 0;
const scan_dir_1 = require("../../../../utils/scan-dir");
const scan_1 = require("../scan");
const merge_scan_1 = require("../merge-scan");
const base_1 = require("./base");
class RootWorker extends base_1.BaseWorker {
    async validateRootPath(dir) {
        const d = dir.trim();
        if (d[0] === '.') {
            return Promise.reject(Error('Root Directory must be absolute'));
        }
        if (d.length === 0 || d.includes('*')) {
            return Promise.reject(Error('Root Directory invalid'));
        }
        const roots = await this.orm.Root.all();
        for (const r of roots) {
            if (dir.startsWith(r.path) || r.path.startsWith(dir)) {
                return Promise.reject(Error('Root path already used'));
            }
        }
    }
    async remove(root, changes) {
        const removedTracks = await this.orm.Track.find({ root: root.id });
        const removedFolders = await this.orm.Folder.find({ root: root.id });
        const removedArtworks = await this.orm.Artwork.findFilter({ folderIDs: removedFolders.map(r => r.id) });
        changes.folders.removed.append(removedFolders);
        changes.artworks.removed.append(removedArtworks);
        changes.tracks.removed.append(removedTracks);
        changes.roots.removed.add(root);
    }
    async scan(root, changes) {
        const dirScanner = new scan_dir_1.DirScanner();
        const scanDir = await dirScanner.scan(root.path);
        const scanMatcher = new scan_1.WorkerScan(this.orm, root, this.audioModule, this.imageModule, changes);
        const matchRoot = await scanMatcher.match(scanDir);
        const scanMerger = new merge_scan_1.WorkerMergeScan(root.strategy, changes);
        await scanMerger.merge(matchRoot);
    }
    async create(name, path, strategy) {
        await this.validateRootPath(path);
        const root = this.orm.Root.create({ name, path, strategy });
        await this.orm.orm.em.persistAndFlush(root);
        return root;
    }
    async update(root, name, path, strategy) {
        root.name = name;
        if (root.path !== path) {
            await this.validateRootPath(path);
            root.path = path;
        }
        root.strategy = strategy;
        this.orm.orm.em.persistLater(root);
    }
}
exports.RootWorker = RootWorker;
//# sourceMappingURL=root.js.map