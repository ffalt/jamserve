import { UserRole } from '../../types/enums.js';
import { MetaDataResult } from './metadata.model.js';
import {
	AcousticBrainzLookupArgs,
	AcoustidLookupArgs,
	CoverArtArchiveImageArgs,
	CoverArtArchiveLookupArgs,
	LastFMLookupArgs,
	LyricsOVHSearchArgs,
	MusicBrainzLookupArgs,
	MusicBrainzSearchArgs,
	WikidataLookupArgs,
	WikidataSummaryArgs,
	WikipediaSummaryArgs
} from './metadata.args.js';
import { Context } from '../../modules/engine/rest/context.js';
import { ApiImageTypes } from '../../types/consts.js';
import {Controller} from '../../modules/rest/decorators/Controller.js';
import {Get} from '../../modules/rest/decorators/Get.js';
import {QueryParams} from '../../modules/rest/decorators/QueryParams.js';
import {Ctx} from '../../modules/rest/decorators/Ctx.js';
import {ApiBinaryResult} from '../../modules/deco/express/express-responder.js';

@Controller('/metadata', { tags: ['Meta Data'], roles: [UserRole.stream] })
export class MetaDataController {
	@Get('/lastfm/lookup', () => MetaDataResult,
		{ description: 'Lookup LastFM data', summary: 'Lookup LastFM' })
	async lastfmLookup(
		@QueryParams() args: LastFMLookupArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.lastFMLookup(orm, args.type, args.mbID) };
	}

	@Get('/lyricsovh/search', () => MetaDataResult,
		{ description: 'Search Lyrics.ovh data', summary: 'Search Lyrics' })
	async lyricsovhSearch(
		@QueryParams() args: LyricsOVHSearchArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.lyrics(orm, args.artist, args.title) };
	}

	@Get('/acoustid/lookup', () => MetaDataResult,
		{ description: 'Lookup AcoustId data', summary: 'Lookup AcoustId' })
	async acoustidLookup(
		@QueryParams() args: AcoustidLookupArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		const track = await orm.Track.oneOrFailByID(args.trackID);
		return { data: await engine.metadata.acoustidLookupTrack(track, args.inc) };
	}

	@Get('/musicbrainz/lookup', () => MetaDataResult,
		{ description: 'Lookup MusicBrainz data', summary: 'Lookup MusicBrainz' })
	async musicbrainzLookup(
		@QueryParams() args: MusicBrainzLookupArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.musicbrainzLookup(orm, args.type, args.mbID, args.inc) };
	}

	@Get('/musicbrainz/search', () => MetaDataResult,
		{ description: 'Search MusicBrainz data', summary: 'Search MusicBrainz' })
	async musicbrainzSearch(
		@QueryParams() args: MusicBrainzSearchArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.musicbrainzSearch(orm, args.type, { ...args, type: undefined }) };
	}

	@Get('/acousticbrainz/lookup', () => MetaDataResult,
		{ description: 'Lookup AcousticBrainz data', summary: 'Lookup AcousticBrainz' })
	async acousticbrainzLookup(
		@QueryParams() args: AcousticBrainzLookupArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.acousticbrainzLookup(orm, args.mbID, args.nr) };
	}

	@Get('/coverartarchive/lookup', () => MetaDataResult,
		{ description: 'Lookup CoverArtArchive data', summary: 'Lookup CoverArtArchive' })
	async coverartarchiveLookup(
		@QueryParams() args: CoverArtArchiveLookupArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.coverartarchiveLookup(orm, args.type, args.mbID) };
	}

	@Get('/coverartarchive/image', {
		binary: ApiImageTypes,
		description: 'Get CoverArtArchive image', summary: 'Request CoverArtArchive Image'
	})
	async coverartarchiveImage(
		@QueryParams() imageArgs: CoverArtArchiveImageArgs,
		@Ctx() { engine }: Context
	): Promise<ApiBinaryResult | undefined> {
		return engine.metadata.coverartarchiveImage(imageArgs.url);
	}

	@Get('/wikipedia/summary', () => MetaDataResult,
		{ description: 'Search Wikipedia Summary data', summary: 'Search Wikipedia' })
	async wikipediaSummarySearch(
		@QueryParams() args: WikipediaSummaryArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.wikipediaSummary(orm, args.title, args.lang) };
	}

	@Get('/wikidata/summary', () => MetaDataResult,
		{ description: 'Search WikiData summary data', summary: 'Search Wikidata' })
	async wikidataSummarySearch(
		@QueryParams() args: WikidataSummaryArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.wikidataSummary(orm, args.wikiDataID, args.lang) };
	}

	@Get('/wikidata/lookup', () => MetaDataResult,
		{ description: 'Lookup WikiData summary data', summary: 'Lookup WikiData' })
	async wikidataLookup(
		@QueryParams() args: WikidataLookupArgs,
		@Ctx() { orm, engine }: Context
	): Promise<MetaDataResult> {
		return { data: await engine.metadata.wikidataLookup(orm, args.wikiDataID) };
	}
}
