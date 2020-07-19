import {Inject} from 'typescript-ioc';
import {Controller, Get, QueryParams} from '../../modules/rest';
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
import {OrmService} from '../../modules/engine/services/orm.service';

@Controller('/metadata', {tags: ['Meta Data'], roles: [UserRole.stream]})
export class MetaDataController {
	@Inject
	private orm!: OrmService;
	@Inject
	private metadataService!: MetaDataService;

	@Get('/lastfm/lookup', () => MetaDataResult,
		{description: 'Lookup LastFM data', summary: 'Lookup LastFM'})
	async lastfmLookup(@QueryParams() args: LastFMLookupArgs): Promise<MetaDataResult> {
		return {data: await this.metadataService.lastFMLookup(args.type, args.mbID)};
	}

	@Get('/lyricsovh/search', () => MetaDataResult,
		{description: 'Search Lyrics.ovh data', summary: 'Search Lyrics'})
	async lyricsovhSearch(@QueryParams() args: LyricsOVHSearchArgs): Promise<MetaDataResult> {
		return {data: await this.metadataService.lyrics(args.artist, args.title)};
	}

	@Get('/acoustid/lookup', () => MetaDataResult,
		{description: 'Lookup AcoustId data', summary: 'Lookup AcoustId'})
	async acoustidLookup(@QueryParams() args: AcoustidLookupArgs): Promise<MetaDataResult> {
		const track = await this.orm.Track.oneOrFail(args.trackID);
		return {data: await this.metadataService.acoustidLookupTrack(track, args.inc)};
	}

	@Get('/musicbrainz/lookup', () => MetaDataResult,
		{description: 'Lookup MusicBrainz data', summary: 'Lookup MusicBrainz'})
	async musicbrainzLookup(@QueryParams() args: MusicBrainzLookupArgs): Promise<MetaDataResult> {
		return {data: await this.metadataService.musicbrainzLookup(args.type, args.mbID, args.inc)};
	}

	@Get('/musicbrainz/search', () => MetaDataResult,
		{description: 'Search MusicBrainz data', summary: 'Search MusicBrainz'})
	async musicbrainzSearch(@QueryParams() args: MusicBrainzSearchArgs): Promise<MetaDataResult> {
		return {data: await this.metadataService.musicbrainzSearch(args.type, args)};
	}

	@Get('/acousticbrainz/lookup', () => MetaDataResult,
		{description: 'Lookup AcousticBrainz data', summary: 'Lookup AcousticBrainz'})
	async acousticbrainzLookup(@QueryParams() args: AcousticBrainzLookupArgs): Promise<MetaDataResult> {
		return {data: await this.metadataService.acousticbrainzLookup(args.mbID, args.nr)};
	}

	@Get('/coverartarchive/lookup', () => MetaDataResult,
		{description: 'Lookup CoverArtArchive data', summary: 'Lookup CoverArtArchive'})
	async coverartarchiveLookup(@QueryParams() args: CoverArtArchiveLookupArgs): Promise<MetaDataResult> {
		return {data: await this.metadataService.coverartarchiveLookup(args.type, args.mbID)};
	}

	@Get('/wikipedia/summary', () => MetaDataResult,
		{description: 'Search Wikipedia Summary data', summary: 'Search Wikipedia'})
	async wikipediaSummarySearch(@QueryParams() args: WikipediaSummaryArgs): Promise<MetaDataResult> {
		return {data: await this.metadataService.wikipediaSummary(args.title, args.lang)};
	}

	@Get('/wikidata/summary', () => MetaDataResult,
		{description: 'Search WikiData summary data', summary: 'Search Wikidata'})
	async wikidataSummarySearch(@QueryParams() args: WikidataSummaryArgs): Promise<MetaDataResult> {
		return {data: await this.metadataService.wikidataSummary(args.wikiDataID, args.lang)};
	}

	@Get('/wikidata/lookup', () => MetaDataResult,
		{description: 'Lookup WikiData summary data', summary: 'Lookup WikiData'})
	async wikidataLookup(@QueryParams() args: WikidataLookupArgs): Promise<MetaDataResult> {
		return {data: await this.metadataService.wikidataLookup(args.wikiDataID)};
	}
}
