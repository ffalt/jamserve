import { slugify } from './slug.js';

export interface MetaStatValue<T> {
	count: number;
	val: T;
}

export type MetaStatString = MetaStatValue<string>;

export type MetaStatNumber = MetaStatValue<number>;

export class MetaStatBuilder {
	stats: Record<string, Record<string, { count: number; val: string | number }>> = {};

	private static convert2Numlist(o: Record<string, { count: number; val: string | number }>): Array<MetaStatNumber> {
		return Object.keys(o)
			.map(key => ({ count: o[key].count, val: Number(o[key].val) }))
			.sort((a, b) => a.count - b.count);
	}

	private static convert2list(o: Record<string, { count: number; val: string | number }>): Array<MetaStatString | MetaStatNumber> {
		return Object.keys(o)
			.map(key => o[key])
			.sort((a, b) => a.count - b.count) as Array<MetaStatString | MetaStatNumber>;
	}

	private static getMostUsedTagValue<T>(list: Array<MetaStatValue<T>>, multi?: T): T | undefined {
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

	statID(name: string, value?: string): void {
		if (value && value.trim().length > 0) {
			let slug = value.split(' ').at(0) ?? value;
			slug = slug.trim();
			this.stats[name] = this.stats[name] ?? {};
			const stat = this.stats[name];
			stat[slug] = stat[value] ?? { count: 0, val: slug };
			stat[slug].count += 1;
		}
	}

	statNumber(name: string, value?: number | null): void {
		if (value !== undefined && value !== null) {
			const slug = value.toString();
			this.stats[name] = this.stats[name] ?? {};
			const stat = this.stats[name];
			stat[slug] = stat[slug] ?? { count: 0, val: value };
			stat[slug].count += 1;
		}
	}

	statSlugValue(name: string, value?: string): void {
		if (value && value.trim().length > 0) {
			const slug = slugify(value);
			this.stats[name] = this.stats[name] ?? {};
			const stat = this.stats[name];
			stat[slug] = stat[slug] ?? { count: 0, val: value.trim() };
			stat[slug].count += 1;
		}
	}

	statTrackCount(name: string, trackTotal?: number, disc?: number): void {
		if (trackTotal !== undefined) {
			const slug = `${(disc ?? 1)}-${trackTotal}`;
			this.stats[name] = this.stats[name] ?? {};
			const stat = this.stats[name];
			stat[slug] = stat[slug] ?? { count: 0, val: trackTotal };
			stat[slug].count += 1;
		}
	}

	asList(name: string): Array<MetaStatString | MetaStatNumber> {
		return MetaStatBuilder.convert2list(this.stats[name] ?? {});
	}

	asStringList(name: string): Array<string> {
		return MetaStatBuilder.convert2list(this.stats[name] ?? {})
			.sort((a, b) => a.count - b.count)
			.map(entry => entry.val.toString());
	}

	asNumberList(name: string): Array<MetaStatNumber> {
		return MetaStatBuilder.convert2Numlist(this.stats[name] ?? {});
	}

	mostUsed(name: string, multi?: string): undefined | string {
		const list = this.asList(name) as Array<MetaStatString>;
		return MetaStatBuilder.getMostUsedTagValue<string>(list, multi);
	}

	mostUsedNumber(name: string): undefined | number {
		const list = this.asNumberList(name);
		return MetaStatBuilder.getMostUsedTagValue<number>(list);
	}
}
