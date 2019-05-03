import {WebserviceXMLClient} from '../../../utils/webservice-xml-client';

export interface ChartLyricsResult {
	id: string;
	trackId: string;
	trackChecksum: string;
	song: string;
	artist: string;
	url: string;
	covertArtUrl: string;
	rank: string;
	correctUrl: string;
	lyric: string;
}

export class ChartLyricsClient extends WebserviceXMLClient {

	constructor(userAgent: string) {
		super(1, 1000, userAgent);
	}

	async search(artistName: string, songName: string): Promise<ChartLyricsResult | undefined> {
		const opts = {
			artist: artistName,
			song: songName
		};
		const data = await this.getJson<any>('http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect', opts);
		if (!data || !data.GetLyricResult) {
			return;
		}
		const o = data.GetLyricResult;
		const result: ChartLyricsResult = {
			id: (o.LyricId ? o.LyricId[0] : '') || '',
			trackId: (o.TrackId ? o.TrackId[0] : '') || '',
			trackChecksum: (o.TrackChecksum ? o.TrackChecksum[0] : '') || '',
			song: (o.LyricSong ? o.LyricSong[0] : '') || '',
			artist: (o.LyricArtist ? o.LyricArtist[0] : '') || '',
			url: (o.LyricUrl ? o.LyricUrl[0] : '') || '',
			covertArtUrl: (o.LyricCovertArtUrl ? o.LyricCovertArtUrl[0] : '') || '',
			rank: (o.LyricRank ? o.LyricRank[0] : '') || '',
			correctUrl: (o.LyricCorrectUrl ? o.LyricCorrectUrl[0] : '') || '',
			lyric: (o.Lyric ? o.Lyric[0] : '') || ''
		};
		return result;
	}
}
