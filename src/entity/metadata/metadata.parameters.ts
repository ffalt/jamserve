import { CoverArtArchiveLookupType, LastFMLookupType, MusicBrainzLookupType, MusicBrainzSearchType } from '../../types/enums.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class LastFMLookupParameters {
	@ObjectField({ description: 'MusicBrainz ID', example: examples.mbReleaseID })
	mbID!: string;

	@ObjectField(() => LastFMLookupType, { description: 'lookup by lastfm type', example: LastFMLookupType.album })
	type!: LastFMLookupType;
}

@ObjectParametersType()
export class LyricsOVHSearchParameters {
	@ObjectField({ description: 'Song Title', example: 'Jerry Was a Race Car Driver' })
	title!: string;

	@ObjectField({ description: 'Song Artist', example: 'Primus' })
	artist!: string;
}

@ObjectParametersType()
export class LrclibSearchParameters {
	@ObjectField({ description: 'Song Title', example: 'Jerry Was a Race Car Driver' })
	title!: string;

	@ObjectField({ description: 'Song Artist', example: 'Primus' })
	artist!: string;

	@ObjectField({ description: 'Song Album', example: 'Sailing the Seas of Cheese' })
	album?: string;

	@ObjectField({ description: 'Song Duration in seconds', example: 191 })
	duration?: number;
}

@ObjectParametersType()
export class AcoustidLookupParameters {
	@ObjectField({ description: 'Track ID', example: examples.mbTrackID })
	trackID!: string;

	@ObjectField({ nullable: true, description: 'Lookup Includes (comma-separated AcoustId includes)', defaultValue: 'recordings,releases,releasegroups,tracks,compress,usermeta,sources' })
	inc?: string; // TODO: typescript-type the acoustid lookup includes
}

@ObjectParametersType()
export class MusicBrainzLookupParameters {
	@ObjectField({ description: 'MusicBrainz ID', example: examples.mbReleaseID })
	mbID!: string;

	@ObjectField(() => MusicBrainzLookupType, { description: 'MusicBrainz Lookup Type', example: MusicBrainzLookupType.release })
	type!: MusicBrainzLookupType;

	@ObjectField({ nullable: true, description: 'Lookup Includes (comma-separated MusicBrainz includes https://musicbrainz.org/doc/Development/XML_Web_Service/Version_2#Lookups )' })
	inc?: string; // TODO: typescript-type the musicbrainz lookup includes
}

@ObjectParametersType()
export class MusicBrainzSearchParameters {
	@ObjectField(() => MusicBrainzSearchType, { description: 'MusicBrainz Search Type', example: MusicBrainzSearchType.artist })
	type!: MusicBrainzSearchType;

	@ObjectField({ nullable: true, description: 'Search by Recording Name' })
	recording?: string;

	@ObjectField({ nullable: true, description: 'Search by Releasegroup Name' })
	releasegroup?: string;

	@ObjectField({ nullable: true, description: 'Search by Release Name' })
	release?: string;

	@ObjectField({ nullable: true, description: 'Search by Artist Name' })
	artist?: string;

	@ObjectField({ nullable: true, description: 'Search by Number of Release Tracks', min: 0 })
	tracks?: number;
}

@ObjectParametersType()
export class AcousticBrainzLookupParameters {
	@ObjectField({ description: 'MusicBrainz ID', example: examples.mbReleaseID })
	mbID!: string;

	@ObjectField({ nullable: true, description: 'Page parameter if more than one acousticbrainz info is available', min: 0 })
	nr?: number;
}

@ObjectParametersType()
export class CoverArtArchiveLookupParameters {
	@ObjectField({ description: 'MusicBrainz ID', example: examples.mbReleaseID })
	mbID!: string;

	@ObjectField(() => CoverArtArchiveLookupType, { description: 'Lookup by CoverArtArchive MusicBrainz Type', example: CoverArtArchiveLookupType.release })
	type!: CoverArtArchiveLookupType;
}

@ObjectParametersType()
export class CoverArtArchiveImageParameters {
	@ObjectField({ description: 'Coverart URL' })
	url!: string;
}

@ObjectParametersType()
export class WikipediaSummaryParameters {
	@ObjectField({ description: 'MusicBrainz ID', example: 'Primus' })
	title!: string;

	@ObjectField({ nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en' })
	lang?: string;
}

@ObjectParametersType()
export class WikidataSummaryParameters {
	@ObjectField({ description: 'WikiData ID' })
	wikiDataID!: string;

	@ObjectField({ nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en' })
	lang?: string;
}

@ObjectParametersType()
export class WikidataLookupParameters {
	@ObjectField({ description: 'WikiData ID' })
	wikiDataID!: string;
}
