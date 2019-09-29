import {slugify} from '../../../utils/slug';

export interface MetaStatValue<T> {
	count: number;
	val: T;
}

export interface MetaStatString extends MetaStatValue<string> {
}

export interface MetaStatNumber extends MetaStatValue<number> {
}

export class MetaStatBuilder {
	stats: {
		[name: string]: { [key: string]: { count: number, val: string }; };
	} = {};

	private static convert2Numlist(o: { [key: string]: { count: number, val: string }; }): Array<MetaStatNumber> {
		return Object.keys(o).map(key => {
			return {count: o[key].count, val: Number(o[key].val)};
		}).sort((a, b) => {
			return a.count - b.count;
		});
	}

	private static convert2list(o: { [key: string]: { count: number, val: string }; }): Array<MetaStatString> {
		return Object.keys(o).map(key => {
			return o[key];
		}).sort((a, b) => {
			return a.count - b.count;
		});
	}

	private static getMostUsedTagValue<T>(list: Array<MetaStatValue<T>>, multi?: T): T | undefined {
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
		const cleaned = list.filter(o => {
			return o.count > 1;
		});
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

	statID(name: string, val?: string): void {
		if (val && val.trim().length > 0) {
			const slug = val.split(' ')[0].trim();
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][val] || {count: 0, val: slug};
			this.stats[name][slug].count += 1;
		}
	}

	statNumber(name: string, val?: number): void {
		if (val !== undefined) {
			const slug = val.toString();
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][slug] || {count: 0, val};
			this.stats[name][slug].count += 1;
		}
	}

	statSlugValue(name: string, val?: string): void {
		if (val && val.trim().length > 0) {
			const slug = slugify(val);
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][slug] || {count: 0, val: val.trim()};
			this.stats[name][slug].count += 1;
		}
	}

	statTrackCount(name: string, trackTotal?: number, disc?: number): void {
		if (trackTotal !== undefined) {
			const slug = `${(disc !== undefined ? disc : 1)}-${trackTotal}`;
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][slug] || {count: 0, val: trackTotal};
			this.stats[name][slug].count += 1;
		}
	}

	asList(name: string): Array<MetaStatString> {
		return MetaStatBuilder.convert2list(this.stats[name] || {});
	}

	asNumberList(name: string): Array<MetaStatNumber> {
		return MetaStatBuilder.convert2Numlist(this.stats[name] || {});
	}

	mostUsed(name: string, multi?: string): undefined | string {
		const list = this.asList(name);
		return MetaStatBuilder.getMostUsedTagValue<string>(list, multi);
	}

	mostUsedNumber(name: string): undefined | number {
		const list = this.asNumberList(name);
		return MetaStatBuilder.getMostUsedTagValue<number>(list);
	}

}
