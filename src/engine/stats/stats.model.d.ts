export interface AlbumTypeStats {
	album: number;
	compilation: number;
	artist_compilation: number;
	unknown: number;
	live: number;
	audiobook: number;
	soundtrack: number;
	bootleg: number;
	ep: number;
	single: number;
}

export interface Stats {
	rootID?: string;
	track: number;
	folder: number;
	series: number;
	album: number;
	albumTypes: AlbumTypeStats;
	artist: number;
	artistTypes: AlbumTypeStats;
}
