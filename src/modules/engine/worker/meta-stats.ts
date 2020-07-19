import path from 'path';
import {AlbumType, FolderType, RootScanStrategy} from '../../../types/enums';
import {Track} from '../../../entity/track/track';
import {MetaStatBuilder} from '../../../utils/stats-builder';
import {extractAlbumName} from '../../../utils/album-name';
import {MatchNode} from './scan';
import {MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from '../../../types/consts';
import {Folder} from '../../../entity/folder/folder';

export interface MetaStat {
	artist?: string;
	artistSort?: string;
	album?: string;
	genres?: Array<string>;
	mbArtistID?: string;
	mbReleaseID?: string;
	mbReleaseGroupID?: string;
	mbAlbumType?: string;
	year?: number;
	hasMultipleArtists: boolean;
	hasMultipleAlbums: boolean;
	trackCount: number;
	folderCount: number;
	subFolderTrackCount: number;
	subFolderCount: number;
	albumType: AlbumType;
}

const typeByGenreNames: { [name: string]: AlbumType } = {
	audiobook: AlbumType.audiobook,
	'audio theater': AlbumType.audiobook,
	'audio drama': AlbumType.audiobook,
	'audio series': AlbumType.audiobook,
	soundtrack: AlbumType.soundtrack
};

const typeByMusicbrainzString: Array<{ type: AlbumType; names: Array<string> }> = [
	{type: AlbumType.audiobook, names: ['audiobook', 'spokenword', 'audiodrama', 'audio drama', 'audio theater', 'audio series']},
	{type: AlbumType.bootleg, names: ['bootleg']},
	{type: AlbumType.compilation, names: ['compilation']},
	{type: AlbumType.live, names: ['live']},
	{type: AlbumType.soundtrack, names: ['soundtrack']},
	{type: AlbumType.ep, names: ['ep']},
	{type: AlbumType.single, names: ['single']},
	{type: AlbumType.album, names: ['album']}
];

export class MatchNodeMetaStats {

	private static getGenreAlbumType(genre: string): AlbumType {
		return typeByGenreNames[genre.toLowerCase()] || AlbumType.unknown;
	}

	private static getMusicbrainzAlbumType(mbAlbumType: string): AlbumType {
		const t = mbAlbumType.toLowerCase();
		for (const type of typeByMusicbrainzString) {
			for (const name of type.names) {
				if (t.includes(name)) {
					return type.type;
				}
			}
		}
		return AlbumType.unknown;
	}

	private static getStrategyAlbumType(strategy: RootScanStrategy, hasMultipleArtists: boolean): AlbumType {
		switch (strategy) {
			case RootScanStrategy.auto:
				return hasMultipleArtists ? AlbumType.compilation : AlbumType.album;
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

	private static async buildTrackSlugs(track: Track | undefined, builder: MetaStatBuilder): Promise<void> {
		const tag = track?.tag;
		if (!tag) {
			return;
		}
		builder.statSlugValue('artist', tag.albumArtist || tag.artist);
		builder.statSlugValue('artistSort', tag.albumArtistSort || tag.artistSort);
		for (const genre of (tag.genres || [])) {
			builder.statSlugValue('genre', genre);
		}
		builder.statSlugValue('series', tag.series);
		builder.statSlugValue('album', tag.album ? extractAlbumName(tag.album) : undefined);
		builder.statNumber('year', tag.year);
		builder.statTrackCount('totalTrackCount', tag.trackTotal, tag.disc);
		builder.statSlugValue('mbAlbumType', `${tag.mbAlbumType || ''}/${tag.mbAlbumStatus || ''}`);
		builder.statID('mbArtistID', tag.mbArtistID);
		builder.statID('mbReleaseID', tag.mbReleaseID);
		builder.statID('mbReleaseGroupID', tag.mbReleaseGroupID);
	}

	private static async buildTracksSlugs(node: MatchNode, builder: MetaStatBuilder): Promise<void> {
		for (const track of node.tracks) {
			await MatchNodeMetaStats.buildTrackSlugs(track, builder);
		}
	}

	private static buildSubFolderSlugs(folder: Folder, builder: MetaStatBuilder): void {
		builder.statSlugValue('artist', folder.artist);
		builder.statSlugValue('artistSort', folder.artistSort);
		builder.statSlugValue('album', folder.album ? extractAlbumName(folder.album) : undefined);
		if (folder.genres) {
			for (const genre of folder.genres) {
				builder.statSlugValue('genre', genre);
			}
		}
		builder.statNumber('year', folder.year);
		builder.statSlugValue('mbAlbumType', folder.mbAlbumType);
		builder.statID('mbArtistID', folder.mbArtistID);
		builder.statID('mbReleaseID', folder.mbReleaseID);
		builder.statID('mbReleaseGroupID', folder.mbReleaseGroupID);
	}

	private static recursiveCount(dir: MatchNode): { subFolderTrackCount: number; subFolderCount: number } {
		let subFolderTrackCount = 0;
		let subFolderCount = 0;
		for (const child of dir.children) {
			if (child.folder.folderType !== FolderType.extras) {
				const result = MatchNodeMetaStats.recursiveCount(child);
				subFolderCount += result.subFolderCount + 1;
				subFolderTrackCount += result.subFolderTrackCount;
			}
			subFolderTrackCount += child.tracks.length;
		}
		return {subFolderTrackCount, subFolderCount};
	}

	private static async buildSubFoldersSlugs(dir: MatchNode, builder: MetaStatBuilder): Promise<void> {
		for (const child of dir.children) {
			if (child.folder.folderType !== FolderType.extras) {
				await MatchNodeMetaStats.buildSubFolderSlugs(child.folder, builder);
			}
		}
	}

	private static getAlbumInfo(builder: MetaStatBuilder, strategy: RootScanStrategy): { albumType: AlbumType; artist?: string; genres?: Array<string>; mbAlbumType?: string; hasMultipleArtists: boolean } {
		// heuristically most used values
		const artist = builder.mostUsed('artist', MUSICBRAINZ_VARIOUS_ARTISTS_NAME);
		const genre = builder.mostUsed('genre');
		const mbAlbumType = builder.mostUsed('mbAlbumType', '');
		// determinate album type
		const hasMultipleArtists = artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME;
		let albumType = AlbumType.unknown;
		if (genre) {
			albumType = MatchNodeMetaStats.getGenreAlbumType(genre);
		}
		if (mbAlbumType && albumType === AlbumType.unknown) {
			albumType = MatchNodeMetaStats.getMusicbrainzAlbumType(mbAlbumType);
		}
		if (albumType === AlbumType.unknown) {
			albumType = MatchNodeMetaStats.getStrategyAlbumType(strategy, hasMultipleArtists);
		}
		if (albumType === AlbumType.audiobook) {
			const series = builder.mostUsed('series');
			if (series) {
				albumType = AlbumType.series;
			}
		}
		return {albumType, artist, hasMultipleArtists, mbAlbumType, genres: builder.asStringList('genre')};
	}


	static async buildMetaStat(node: MatchNode, strategy: RootScanStrategy): Promise<MetaStat> {
		const builder = new MetaStatBuilder();
		await MatchNodeMetaStats.buildTracksSlugs(node, builder);
		const {subFolderTrackCount, subFolderCount} = MatchNodeMetaStats.recursiveCount(node);
		await MatchNodeMetaStats.buildSubFoldersSlugs(node, builder);
		const {albumType, artist, hasMultipleArtists, mbAlbumType, genres} = MatchNodeMetaStats.getAlbumInfo(builder, strategy);
		return {
			trackCount: node.tracks.length,
			folderCount: node.children.filter(c => c.folder.folderType !== FolderType.extras).length,
			subFolderTrackCount,
			subFolderCount,
			albumType,
			genres,
			artist,
			hasMultipleArtists,
			mbAlbumType,
			hasMultipleAlbums: builder.asList('album').length > 1,
			album: builder.mostUsed('album', extractAlbumName(path.basename(node.scan.path))),
			artistSort: hasMultipleArtists ? undefined : builder.mostUsed('artistSort'),
			mbReleaseID: builder.mostUsed('mbReleaseID', ''),
			mbReleaseGroupID: builder.mostUsed('mbReleaseGroupID', ''),
			mbArtistID: builder.mostUsed('mbArtistID', ''),
			year: builder.mostUsedNumber('year')
		};
	}
}
