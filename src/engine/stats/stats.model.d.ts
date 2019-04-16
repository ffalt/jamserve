export interface AlbumTypeStats {
	album: number;
	compilation: number;
	audiobook: number;
	soundtrack: number;
	bootleg: number;
}

export interface Stats {
	rootID?: string;
	track: number;
	folder: number;
	album: number;
	albumTypes: AlbumTypeStats;
	artist: number;
	artistTypes: AlbumTypeStats;
}
