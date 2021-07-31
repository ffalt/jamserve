export class IdSet {
    constructor() {
        this.set = new Set();
    }
    get size() {
        return this.set.size;
    }
    add(item) {
        if (item) {
            this.set.add(item.id);
        }
    }
    addID(item) {
        if (item) {
            this.set.add(item);
        }
    }
    has(item) {
        return this.set.has(item.id);
    }
    hasID(item) {
        return this.set.has(item);
    }
    delete(item) {
        this.set.delete(item.id);
    }
    ids() {
        return [...this.set];
    }
    append(items) {
        for (const item of items) {
            this.add(item);
        }
    }
    appendIDs(items) {
        for (const item of items) {
            this.set.add(item);
        }
    }
}
export class ChangeSet {
    constructor() {
        this.added = new IdSet();
        this.updated = new IdSet();
        this.removed = new IdSet();
    }
}
export class Changes {
    constructor() {
        this.artists = new ChangeSet();
        this.albums = new ChangeSet();
        this.tracks = new ChangeSet();
        this.roots = new ChangeSet();
        this.folders = new ChangeSet();
        this.series = new ChangeSet();
        this.artworks = new ChangeSet();
        this.genres = new ChangeSet();
        this.start = Date.now();
        this.end = 0;
    }
}
//# sourceMappingURL=changes.js.map