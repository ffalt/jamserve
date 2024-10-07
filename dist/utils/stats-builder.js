import { slugify } from './slug.js';
export class MetaStatBuilder {
    constructor() {
        this.stats = {};
    }
    static convert2Numlist(o) {
        return Object.keys(o)
            .map(key => ({ count: o[key].count, val: Number(o[key].val) }))
            .sort((a, b) => a.count - b.count);
    }
    static convert2list(o) {
        return Object.keys(o)
            .map(key => o[key])
            .sort((a, b) => a.count - b.count);
    }
    static getMostUsedTagValue(list, multi) {
        if (list.length === 0) {
            return undefined;
        }
        if (list.length === 1) {
            return list[0].val;
        }
        list = list.sort((a, b) => b.count - a.count);
        if (list[0].count - list[1].count > 4) {
            return list[0].val;
        }
        if (list.length > 3 && multi !== undefined) {
            return multi;
        }
        const cleaned = list.filter(o => o.count > 1);
        if (cleaned.length > 1 && multi !== undefined) {
            return multi;
        }
        if (cleaned.length > 0) {
            return cleaned[0].val;
        }
        if (multi !== undefined) {
            return multi;
        }
        return list[0].val;
    }
    statID(name, val) {
        if (val && val.trim().length > 0) {
            const slug = val.split(' ')[0].trim();
            this.stats[name] = this.stats[name] || {};
            this.stats[name][slug] = this.stats[name][val] || { count: 0, val: slug };
            this.stats[name][slug].count += 1;
        }
    }
    statNumber(name, val) {
        if (val !== undefined && val !== null) {
            const slug = val.toString();
            this.stats[name] = this.stats[name] || {};
            this.stats[name][slug] = this.stats[name][slug] || { count: 0, val };
            this.stats[name][slug].count += 1;
        }
    }
    statSlugValue(name, val) {
        if (val && val.trim().length > 0) {
            const slug = slugify(val);
            this.stats[name] = this.stats[name] || {};
            this.stats[name][slug] = this.stats[name][slug] || { count: 0, val: val.trim() };
            this.stats[name][slug].count += 1;
        }
    }
    statTrackCount(name, trackTotal, disc) {
        if (trackTotal !== undefined) {
            const slug = `${(disc !== undefined ? disc : 1)}-${trackTotal}`;
            this.stats[name] = this.stats[name] || {};
            this.stats[name][slug] = this.stats[name][slug] || { count: 0, val: trackTotal };
            this.stats[name][slug].count += 1;
        }
    }
    asList(name) {
        return MetaStatBuilder.convert2list(this.stats[name] || {});
    }
    asStringList(name) {
        return MetaStatBuilder.convert2list(this.stats[name] || {})
            .sort((a, b) => a.count - b.count)
            .map(entry => entry.val);
    }
    asNumberList(name) {
        return MetaStatBuilder.convert2Numlist(this.stats[name] || {});
    }
    mostUsed(name, multi) {
        const list = this.asList(name);
        return MetaStatBuilder.getMostUsedTagValue(list, multi);
    }
    mostUsedNumber(name) {
        const list = this.asNumberList(name);
        return MetaStatBuilder.getMostUsedTagValue(list);
    }
}
//# sourceMappingURL=stats-builder.js.map