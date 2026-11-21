import { MetadataType } from '../../types/enums.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Tag } from '../tag/tag.js';
import { lyricsSlug } from '../../utils/lyrics-slug.js';

export function syncedLyricsUnavailableKey(tag?: Tag): string | undefined {
	if (!tag?.title) {
		return;
	}
	const artist = tag.artist ?? tag.albumArtist;
	return `lyrics-synced-unavailable/${lyricsSlug(artist ?? '')}/${lyricsSlug(tag.title)}`;
}

export async function isSyncedLyricsMarkedUnavailable(orm: Orm, tag?: Tag): Promise<boolean> {
	const name = syncedLyricsUnavailableKey(tag);
	if (!name) {
		return false;
	}
	const entry = await orm.MetaData.findOne({ where: { name, dataType: MetadataType.lyrics } });
	return !!entry;
}

export async function markSyncedLyricsUnavailable(orm: Orm, tag?: Tag): Promise<void> {
	const name = syncedLyricsUnavailableKey(tag);
	if (!name || await isSyncedLyricsMarkedUnavailable(orm, tag)) {
		return;
	}
	const entry = orm.MetaData.create({ name, dataType: MetadataType.lyrics, data: JSON.stringify({ syncedLyrics: false }) });
	await orm.MetaData.persistAndFlush(entry);
}
