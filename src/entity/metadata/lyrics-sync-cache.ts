import { Op } from 'sequelize';
import { MetadataType } from '../../types/enums.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Tag } from '../tag/tag.js';
import { lyricsSlug } from '../../utils/lyrics-slug.js';
import { durationToMilliseconds } from '../../utils/date-time.js';

// the lrclib docs  https://lrclib.net/docs note that a track missing today
// can be picked up by their background fetching service later,
// so the marker expires and is rechecked
export const SYNCED_LYRICS_MARKER_TTL_MS = durationToMilliseconds(30, 'd');

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
	const freshSince = new Date(Date.now() - SYNCED_LYRICS_MARKER_TTL_MS);
	const entry = await orm.MetaData.findOne({ where: { name, dataType: MetadataType.lyrics, createdAt: { [Op.gte]: freshSince } } });
	return !!entry;
}

export async function markSyncedLyricsUnavailable(orm: Orm, tag?: Tag): Promise<void> {
	const name = syncedLyricsUnavailableKey(tag);
	if (!name) {
		return;
	}
	await orm.MetaData.removeByQueryAndFlush({ where: { name, dataType: MetadataType.lyrics } });
	const entry = orm.MetaData.create({ name, dataType: MetadataType.lyrics, data: JSON.stringify({ syncedLyrics: false }) });
	await orm.MetaData.persistAndFlush(entry);
}
