export interface Stats {
	rootID?: string;
	track: number;
	folder: number;
	artist: number;
	album: number;
	albumTypes: {
		album: number;
		compilation: number;
		audiobook: number;
	};
}
