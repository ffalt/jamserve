import {WebserviceXMLClient} from '../../../utils/webservice-xml-client';

export interface ChartLyricsResult {
	id: string;
	trackId: string;
	checksum: string;
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
			id: (o ? o.LyricId[0] : '') || '',
			trackId: (o ? o.TrackId[0] : '') || '',
			checksum: (o ? o.LyricChecksum[0] : '') || '',
			song: (o ? o.LyricSong[0] : '') || '',
			artist: (o ? o.LyricArtist[0] : '') || '',
			url: (o ? o.LyricUrl[0] : '') || '',
			covertArtUrl: (o ? o.LyricCovertArtUrl[0] : '') || '',
			rank: (o ? o.LyricRank[0] : '') || '',
			correctUrl: (o ? o.LyricCorrectUrl[0] : '') || '',
			lyric: (o ? o.Lyric[0] : '') || ''
		};
		return result;
	}
}
