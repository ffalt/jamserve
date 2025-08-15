import { UserRole } from '../../types/enums.js';
import { MetaDataResult } from './metadata.model.js';
import {
	AcousticBrainzLookupParameters,
	AcoustidLookupParameters,
	CoverArtArchiveImageParameters,
	CoverArtArchiveLookupParameters,
	LastFMLookupParameters,
	LyricsOVHSearchParameters,
	LrclibSearchParameters,
	MusicBrainzLookupParameters,
	MusicBrainzSearchParameters,
	WikidataLookupParameters,
	WikidataSummaryParameters,
	WikipediaSummaryParameters
} from './metadata.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { ApiImageTypes } from '../../types/consts.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';

@Controller('/metadata', { tags: ['Meta Data'], roles: [UserRole.stream] })
export class MetaDataController {
	@Get('/lastfm/lookup', () => MetaDataResult,
		{ description: 'Lookup LastFM data', summary: 'Lookup LastFM' })
	async lastfmLookup(
		@QueryParameters() parameters: LastFMLookupParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.lastFMLookup(orm, parameters.type, parameters.mbID) };
	}

	@Get('/lyricsovh/search', () => MetaDataResult,
		{ description: 'Search Lyrics.ovh data', summary: 'Search Lyrics on lyrics.ovh' })
	async lyricsovhSearch(
		@QueryParameters() parameters: LyricsOVHSearchParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.lyricsOVH(orm, parameters.artist, parameters.title) };
	}

	@Get('/lrclib/get', () => MetaDataResult,
		{ description: 'Get Lrclib.net data', summary: 'Get Lyrics on lrclib.net' })
	async lcrlibSearch(
		@QueryParameters() parameters: LrclibSearchParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.lrclibGet(orm, parameters.artist, parameters.title, parameters.album, parameters.duration) };
	}

	@Get('/acoustid/lookup', () => MetaDataResult,
		{ description: 'Lookup AcoustId data', summary: 'Lookup AcoustId' })
	async acoustidLookup(
		@QueryParameters() { trackID, inc }: AcoustidLookupParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		const track = await orm.Track.oneOrFailByID(trackID);
		return { data: await engine.metadata.acoustidLookupTrack(track, inc) };
	}

	@Get('/musicbrainz/lookup', () => MetaDataResult,
		{ description: 'Lookup MusicBrainz data', summary: 'Lookup MusicBrainz' })
	async musicbrainzLookup(
		@QueryParameters() parameters: MusicBrainzLookupParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.musicbrainzLookup(orm, parameters.type, parameters.mbID, parameters.inc) };
	}

	@Get('/musicbrainz/search', () => MetaDataResult,
		{ description: 'Search MusicBrainz data', summary: 'Search MusicBrainz' })
	async musicbrainzSearch(
		@QueryParameters() parameters: MusicBrainzSearchParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.musicbrainzSearch(orm, parameters.type, { ...parameters, type: undefined }) };
	}

	@Get('/acousticbrainz/lookup', () => MetaDataResult,
		{ description: 'Lookup AcousticBrainz data', summary: 'Lookup AcousticBrainz' })
	async acousticbrainzLookup(
		@QueryParameters() { mbID, nr }: AcousticBrainzLookupParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.acousticbrainzLookup(orm, mbID, nr) };
	}

	@Get('/coverartarchive/lookup', () => MetaDataResult,
		{ description: 'Lookup CoverArtArchive data', summary: 'Lookup CoverArtArchive' })
	async coverartarchiveLookup(
		@QueryParameters() { type, mbID }: CoverArtArchiveLookupParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.coverartarchiveLookup(orm, type, mbID) };
	}

	@Get('/coverartarchive/image', {
		binary: ApiImageTypes,
		description: 'Get CoverArtArchive image', summary: 'Request CoverArtArchive Image'
	})
	async coverartarchiveImage(
		@QueryParameters() { url }: CoverArtArchiveImageParameters,
		@RestContext() { engine }: Context
	): Promise<ApiBinaryResult | undefined> {
		return engine.metadata.coverartarchiveImage(url);
	}

	@Get('/wikipedia/summary', () => MetaDataResult,
		{ description: 'Search Wikipedia Summary data', summary: 'Search Wikipedia' })
	async wikipediaSummarySearch(
		@QueryParameters() { title, lang }: WikipediaSummaryParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.wikipediaSummary(orm, title, lang) };
	}

	@Get('/wikidata/summary', () => MetaDataResult,
		{ description: 'Search WikiData summary data', summary: 'Search Wikidata' })
	async wikidataSummarySearch(
		@QueryParameters() { wikiDataID, lang }: WikidataSummaryParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.wikidataSummary(orm, wikiDataID, lang) };
	}

	@Get('/wikidata/lookup', () => MetaDataResult,
		{ description: 'Lookup WikiData summary data', summary: 'Lookup WikiData' })
	async wikidataLookup(
		@QueryParameters() { wikiDataID }: WikidataLookupParameters,
		@RestContext() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.wikidataLookup(orm, wikiDataID) };
	}
}
