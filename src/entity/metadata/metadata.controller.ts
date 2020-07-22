import {InRequestScope, Inject} from 'typescript-ioc';
import {Controller, Ctx, Get, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {MetaDataResult} from './metadata.model';
import {MetaDataService} from './metadata.service';
import {
	AcousticBrainzLookupArgs,
	AcoustidLookupArgs,
	CoverArtArchiveLookupArgs,
	LastFMLookupArgs,
	LyricsOVHSearchArgs,
	MusicBrainzLookupArgs,
	MusicBrainzSearchArgs,
	WikidataLookupArgs,
	WikidataSummaryArgs,
	WikipediaSummaryArgs
} from './metadata.args';
import {Context} from '../../modules/engine/rest/context';

@InRequestScope
@Controller('/metadata', {tags: ['Meta Data'], roles: [UserRole.stream]})
export class MetaDataController {
	@Inject
	private metadataService!: MetaDataService;

	@Get('/lastfm/lookup', () => MetaDataResult,
		{description: 'Lookup LastFM data', summary: 'Lookup LastFM'})
	async lastfmLookup(
		@QueryParams() args: LastFMLookupArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		return {data: await this.metadataService.lastFMLookup(orm, args.type, args.mbID)};
	}

	@Get('/lyricsovh/search', () => MetaDataResult,
		{description: 'Search Lyrics.ovh data', summary: 'Search Lyrics'})
	async lyricsovhSearch(
		@QueryParams() args: LyricsOVHSearchArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		return {data: await this.metadataService.lyrics(orm, args.artist, args.title)};
	}

	@Get('/acoustid/lookup', () => MetaDataResult,
		{description: 'Lookup AcoustId data', summary: 'Lookup AcoustId'})
	async acoustidLookup(
		@QueryParams() args: AcoustidLookupArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		const track = await orm.Track.oneOrFailByID(args.trackID);
		return {data: await this.metadataService.acoustidLookupTrack(track, args.inc)};
	}

	@Get('/musicbrainz/lookup', () => MetaDataResult,
		{description: 'Lookup MusicBrainz data', summary: 'Lookup MusicBrainz'})
	async musicbrainzLookup(
		@QueryParams() args: MusicBrainzLookupArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		return {data: await this.metadataService.musicbrainzLookup(orm, args.type, args.mbID, args.inc)};
	}

	@Get('/musicbrainz/search', () => MetaDataResult,
		{description: 'Search MusicBrainz data', summary: 'Search MusicBrainz'})
	async musicbrainzSearch(
		@QueryParams() args: MusicBrainzSearchArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		return {data: await this.metadataService.musicbrainzSearch(orm, args.type, args)};
	}

	@Get('/acousticbrainz/lookup', () => MetaDataResult,
		{description: 'Lookup AcousticBrainz data', summary: 'Lookup AcousticBrainz'})
	async acousticbrainzLookup(
		@QueryParams() args: AcousticBrainzLookupArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		return {data: await this.metadataService.acousticbrainzLookup(orm, args.mbID, args.nr)};
	}

	@Get('/coverartarchive/lookup', () => MetaDataResult,
		{description: 'Lookup CoverArtArchive data', summary: 'Lookup CoverArtArchive'})
	async coverartarchiveLookup(
		@QueryParams() args: CoverArtArchiveLookupArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		return {data: await this.metadataService.coverartarchiveLookup(orm, args.type, args.mbID)};
	}

	@Get('/wikipedia/summary', () => MetaDataResult,
		{description: 'Search Wikipedia Summary data', summary: 'Search Wikipedia'})
	async wikipediaSummarySearch(
		@QueryParams() args: WikipediaSummaryArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		return {data: await this.metadataService.wikipediaSummary(orm, args.title, args.lang)};
	}

	@Get('/wikidata/summary', () => MetaDataResult,
		{description: 'Search WikiData summary data', summary: 'Search Wikidata'})
	async wikidataSummarySearch(
		@QueryParams() args: WikidataSummaryArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		return {data: await this.metadataService.wikidataSummary(orm, args.wikiDataID, args.lang)};
	}

	@Get('/wikidata/lookup', () => MetaDataResult,
		{description: 'Lookup WikiData summary data', summary: 'Lookup WikiData'})
	async wikidataLookup(
		@QueryParams() args: WikidataLookupArgs,
		@Ctx() {orm}: Context
	): Promise<MetaDataResult> {
		return {data: await this.metadataService.wikidataLookup(orm, args.wikiDataID)};
	}
}
