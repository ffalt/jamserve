import {LastFM} from '../../model/lastfm-rest-data';
import {MetaInfoAlbum, MetaInfoArtist, MetaInfoImage, MetaInfoTopSong, MetaInfoTrackSimilarSong} from './metadata.model';

export class FORMAT {

	static packMediaInfoImage(images: Array<LastFM.Image>): MetaInfoImage {
		let small: string | undefined;
		let medium: string | undefined;
		let large: string | undefined;
		let image = (images || []).find(img => img.size === 'small');
		if (image && image.url && image.url.length > 0) {
			small = image.url;
		}
		image = (images || []).find(img => img.size === 'medium');
		if (image && image.url && image.url.length > 0) {
			medium = image.url;
		}
		image = (images || []).find(img => img.size === 'large');
		if (image && image.url && image.url.length > 0) {
			large = image.url;
		}
		return {
			small: small,
			medium: medium,
			large: large
		};
	}

	static packMediaInfoArtist(data?: LastFM.Artist): MetaInfoArtist | undefined {
		if (!data) {
			return;
		}
		if (!data.mbid) {
			return;
		}
		return {
			name: data.name,
			mbid: data.mbid,
			url: data.url,
			image: this.packMediaInfoImage(data.image),
			tags: data.tags,
			description: data.bio ? data.bio.content : undefined,
			similar: data.similar && data.similar.artist ? data.similar.artist.map(artist => {
				return {
					name: artist.name,
					url: artist.url,
					image: this.packMediaInfoImage(artist.image)
				};
			}) : undefined
		};
	}

	static packMediaInfoSimilarSong(data?: LastFM.SimilarTracks): Array<MetaInfoTrackSimilarSong> {
		if (!data || !data.track || data.track.length === 0) {
			return [];
		}
		return data.track.map(t => {
			return {
				name: t.name,
				mbid: t.mbid,
				url: t.url,
				duration: parseFloat(t.duration),
				artist: {
					name: t.artist.name,
					mbid: t.artist.mbid,
					url: t.artist.name
				},
				image: this.packMediaInfoImage(t.image)
			};
		});
	}

	static packMediaInfoAlbum(data?: LastFM.Album): MetaInfoAlbum | undefined {
		if (!data) {
			return;
		}
		return {
			name: data.name,
			artist: data.artist,
			mbid: data.mbid,
			url: data.url,
			image: this.packMediaInfoImage(data.image),
			tags: data.tags,
			description: data.wiki ? data.wiki.content : undefined
		};
	}

	static packMediaInfoTopSongs(data?: LastFM.TopTracks): Array<MetaInfoTopSong> {
		if (!data || !data.track || data.track.length === 0) {
			return [];
		}
		return data.track.map(t => {
			return {
				name: t.name,
				mbid: t.mbid,
				url: t.url,
				rank: t.rank,
				artist: {
					name: t.artist.name,
					mbid: t.artist.mbid,
					url: t.artist.name
				},
				image: this.packMediaInfoImage(t.image)
			};
		});
	}
}
