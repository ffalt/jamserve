import { Track } from '../../../entity/track/track.js';
import { Artist } from '../../../entity/artist/artist.js';
import { Album } from '../../../entity/album/album.js';
import { Folder } from '../../../entity/folder/folder.js';
import { Series } from '../../../entity/series/series.js';
import { Root } from '../../../entity/root/root.js';
import { Artwork } from '../../../entity/artwork/artwork.js';
import { Genre } from '../../../entity/genre/genre.js';

export class IdSet<T extends { id: string }> {
	private set = new Set<string>();

	get size(): number {
		return this.set.size;
	}

	add(item?: T): void {
		if (item) {
			this.set.add(item.id);
		}
	}

	addID(item?: string): void {
		if (item) {
			this.set.add(item);
		}
	}

	has(item: T): boolean {
		return this.set.has(item.id);
	}

	hasID(item: string): boolean {
		return this.set.has(item);
	}

	delete(item: T): void {
		this.set.delete(item.id);
	}

	ids(): Array<string> {
		return [...this.set];
	}

	append(items: Array<T>): void {
		for (const item of items) {
			this.add(item);
		}
	}

	appendIDs(items: Array<string>): void {
		for (const item of items) {
			this.set.add(item);
		}
	}
}

export class ChangeSet<T extends { id: string }> {
	added = new IdSet<T>();
	updated = new IdSet<T>();
	removed = new IdSet<T>();
}

export class Changes {
	artists = new ChangeSet<Artist>();
	albums = new ChangeSet<Album>();
	tracks = new ChangeSet<Track>();
	roots = new ChangeSet<Root>();
	folders = new ChangeSet<Folder>();
	series = new ChangeSet<Series>();
	artworks = new ChangeSet<Artwork>();
	genres = new ChangeSet<Genre>();
	start: number = Date.now();
	end: number = 0;
}
