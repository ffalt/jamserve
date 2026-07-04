import { slugify } from './slug.js';
export class MetaStatBuilder {
    constructor() {
        this.stats = {};
    }
    static convert2Numlist(o) {
        return Object.values(o)
            .map(value => ({ count: value.count, val: Number(value.val) }))
            .sort((a, b) => a.count - b.count);
    }
    static convert2list(o) {
        return Object.values(o)
            .map(value => value)
            .sort((a, b) => a.count - b.count);
    }
    static getMostUsedTagValue(list, multi) {
        list = list.sort((a, b) => b.count - a.count);
        const item0 = list.at(0);
        if (!item0) {
            return;
        }
        const item1 = list.at(1);
        if (!item1) {
            return item0.val;
        }
        if (item0.count - item1.count > 4) {
            return item0.val;
        }
        if (list.length > 3 && multi !== undefined) {
            return multi;
        }
        const cleaned = list.filter(o => o.count > 1);
        if (cleaned.length > 1 && multi !== undefined) {
            return multi;
        }
        const cleaned0 = cleaned.at(0);
        if (cleaned0) {
            return cleaned0.val;
        }
        if (multi !== undefined) {
            return multi;
        }
        return item0.val;
    }
    statID(name, value) {
        var _a;
        if (!(value && value.trim().length > 0)) {
            return;
        }
        let slug = value.split(' ', 1).at(0) ?? value;
        slug = slug.trim();
        (_a = this.stats)[name] ?? (_a[name] = {});
        const stat = this.stats[name];
        stat[slug] ?? (stat[slug] = { count: 0, val: slug });
        stat[slug].count += 1;
    }
    statNumber(name, value) {
        var _a;
        if (value === undefined || value === null) {
            return;
        }
        const slug = value.toString();
        (_a = this.stats)[name] ?? (_a[name] = {});
        const stat = this.stats[name];
        stat[slug] ?? (stat[slug] = { count: 0, val: value });
        stat[slug].count += 1;
    }
    statSlugValue(name, value) {
        var _a;
        if (!(value && value.trim().length > 0)) {
            return;
        }
        const slug = slugify(value);
        (_a = this.stats)[name] ?? (_a[name] = {});
        const stat = this.stats[name];
        stat[slug] ?? (stat[slug] = { count: 0, val: value.trim() });
        stat[slug].count += 1;
    }
    statTrackCount(name, trackTotal, disc) {
        var _a;
        if (trackTotal === undefined) {
            return;
        }
        const slug = `${(disc ?? 1)}-${trackTotal}`;
        (_a = this.stats)[name] ?? (_a[name] = {});
        const stat = this.stats[name];
        stat[slug] ?? (stat[slug] = { count: 0, val: trackTotal });
        stat[slug].count += 1;
    }
    asList(name) {
        return MetaStatBuilder.convert2list(this.stats[name] ?? {});
    }
    asStringList(name) {
        return MetaStatBuilder.convert2list(this.stats[name] ?? {})
            .sort((a, b) => a.count - b.count)
            .map(entry => entry.val.toString());
    }
    asNumberList(name) {
        return MetaStatBuilder.convert2Numlist(this.stats[name] ?? {});
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