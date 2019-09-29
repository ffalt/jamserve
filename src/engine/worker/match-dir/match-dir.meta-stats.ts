import path from 'path';
import {Jam} from '../../../model/jam-rest-data';
import {AlbumType, FileTyp, FolderType, MUSICBRAINZ_VARIOUS_ARTISTS_NAME, RootScanStrategy} from '../../../model/jam-types';
import {extractAlbumName} from '../../../utils/album-name';
import {FolderTag} from '../../folder/folder.model';
import {Track} from '../../track/track.model';
import {MetaStatBuilder} from './match-dir.meta-stats.builder';
import {MatchDir} from './match-dir.types';

export interface MetaStat {
	artist?: string;
	artistSort?: string;
	album?: string;
	genre?: string;
	mbArtistID?: string;
	mbAlbumID?: string;
	mbReleaseGroupID?: string;
	mbAlbumType?: string;
	year?: number;
	hasMultipleArtists: boolean;
	hasMultipleAlbums: boolean;
	trackCount: number;
	subFolderTrackCount?: number;
	albumType: AlbumType;
}

const typeByGenreNames: { [name: string]: AlbumType } = {
	audiobook: AlbumType.audiobook,
	'audio theater': AlbumType.audiodrama,
	soundtrack: AlbumType.soundtrack
};

export class MatchDirMetaStats {

	private static getGenreAlbumType(genre: string): AlbumType {
		return typeByGenreNames[genre.toLowerCase()] || AlbumType.unknown;
	}

	private static getMusicbrainzAlbumType(mbAlbumType: string): AlbumType {
		const t = mbAlbumType.toLowerCase();
		if (t.includes('audiobook') || t.includes('spokenword')) {
			return AlbumType.audiobook;
		}
		if (t.includes('bootleg')) {
			return AlbumType.bootleg;
		}
		if (t.includes('compilation')) {
			return AlbumType.compilation;
		}
		if (t.includes('live')) {
			return AlbumType.live;
		}
		if (t.includes('soundtrack')) {
			return AlbumType.soundtrack;
		}
		if (t.includes('audiodrama') || t.includes('audio drama')) {
			return AlbumType.audiodrama;
		}
		if (t.includes('ep')) {
			return AlbumType.ep;
		}
		if (t.includes('single')) {
			return AlbumType.single;
		}
		if (t.includes('album')) {
			return AlbumType.album;
		}
		return AlbumType.unknown;
	}

	private static getStrategyAlbumType(strategy: RootScanStrategy, hasMultipleArtists: boolean): AlbumType {
		switch (strategy) {
			case RootScanStrategy.auto:
				if (hasMultipleArtists) {
					return AlbumType.compilation;
				}
				return AlbumType.album;
			case RootScanStrategy.artistalbum:
				return AlbumType.album;
			case RootScanStrategy.compilation:
				return AlbumType.compilation;
			case RootScanStrategy.audiobook:
				return AlbumType.audiobook;
			default:
				return AlbumType.unknown;
		}
	}

	private static buildTrackSlugs(track: Track | undefined, builder: MetaStatBuilder): void {
		if (!track || !track.tag) {
			return;
		}
		const tracktag = track.tag;
		builder.statSlugValue('artist', tracktag.albumArtist || tracktag.artist);
		builder.statSlugValue('artistSort', tracktag.albumArtistSort || tracktag.artistSort);
		builder.statSlugValue('genre', tracktag.genre);
		builder.statSlugValue('album', tracktag.album ? extractAlbumName(tracktag.album) : undefined);
		builder.statNumber('year', tracktag.year);
		builder.statTrackCount('albumTrackCount', tracktag.trackTotal, tracktag.disc);
		builder.statSlugValue('mbAlbumType', `${tracktag.mbAlbumType || ''}/${tracktag.mbAlbumStatus || ''}`);
		builder.statID('mbArtistID', tracktag.mbArtistID);
		builder.statID('mbAlbumID', tracktag.mbAlbumID);
		builder.statID('mbReleaseGroupID', tracktag.mbReleaseGroupID);
	}

	private static buildTracksSlugs(dir: MatchDir, builder: MetaStatBuilder): number {
		let result = 0;
		for (const file of dir.files) {
			if (file.type === FileTyp.AUDIO) {
				result++;
				MatchDirMetaStats.buildTrackSlugs(file.track, builder);
			}
		}
		return result;
	}

	private static buildSubFolderSlugs(subtag: FolderTag, builder: MetaStatBuilder): number {
		builder.statSlugValue('artist', subtag.artist);
		builder.statSlugValue('artistSort', subtag.artistSort);
		builder.statSlugValue('album', subtag.album ? extractAlbumName(subtag.album) : undefined);
		builder.statSlugValue('genre', subtag.genre);
		builder.statNumber('year', subtag.year);
		builder.statSlugValue('mbAlbumType', subtag.mbAlbumType);
		builder.statID('mbArtistID', subtag.mbArtistID);
		builder.statID('mbAlbumID', subtag.mbAlbumID);
		builder.statID('mbReleaseGroupID', subtag.mbReleaseGroupID);
		return subtag.albumTrackCount || 0;
	}

	private static buildSubFoldersSlugs(dir: MatchDir, builder: MetaStatBuilder): number | undefined {
		let result = 0;
		for (const sub of dir.directories) {
			if (sub.folder && sub.tag && (sub.tag.type !== FolderType.extras)) {
				result += MatchDirMetaStats.buildSubFolderSlugs(sub.tag, builder);
			}
		}
		return result > 0 ? result : undefined;
	}

	private static getAlbumInfo(builder: MetaStatBuilder, strategy: RootScanStrategy): { albumType: AlbumType, artist?: string, genre?: string, mbAlbumType?: string, hasMultipleArtists: boolean } {
		// heuristically most used values
		const artist = builder.mostUsed('artist', MUSICBRAINZ_VARIOUS_ARTISTS_NAME);
		const genre = builder.mostUsed('genre');
		const mbAlbumType = builder.mostUsed('mbAlbumType', '');
		// determinate album type
		const hasMultipleArtists = artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME;
		let albumType = AlbumType.unknown;
		if (genre) {
			albumType = MatchDirMetaStats.getGenreAlbumType(genre);
		}
		if (mbAlbumType && albumType === AlbumType.unknown) {
			albumType = MatchDirMetaStats.getMusicbrainzAlbumType(mbAlbumType);
		}
		if (albumType === AlbumType.unknown) {
			albumType = MatchDirMetaStats.getStrategyAlbumType(strategy, hasMultipleArtists);
		}
		return {albumType, artist, hasMultipleArtists, mbAlbumType, genre};
	}

	static buildMetaStat(dir: MatchDir, settings: Jam.AdminSettingsLibrary, strategy: RootScanStrategy): MetaStat {
		const builder = new MetaStatBuilder();
		const trackCount = MatchDirMetaStats.buildTracksSlugs(dir, builder);
		const subFolderTrackCount = MatchDirMetaStats.buildSubFoldersSlugs(dir, builder);
		const {albumType, artist, hasMultipleArtists, mbAlbumType, genre} = MatchDirMetaStats.getAlbumInfo(builder, strategy);
		return {
			trackCount, subFolderTrackCount, albumType, genre, artist, hasMultipleArtists, mbAlbumType,
			hasMultipleAlbums: builder.asList('album').length > 1,
			album: builder.mostUsed('album', extractAlbumName(path.basename(dir.name))),
			artistSort: hasMultipleArtists ? undefined : builder.mostUsed('artistSort'),
			mbAlbumID: builder.mostUsed('mbAlbumID', ''),
			mbReleaseGroupID: builder.mostUsed('mbReleaseGroupID', ''),
			mbArtistID: builder.mostUsed('mbArtistID', ''),
			year: builder.mostUsedNumber('year')
		};
	}
}
