export interface Stats {
	rootID?: string;
	track: number;
	folder: number;
	album: number;
	albumTypes: {
		album: number;
		compilation: number;
		audiobook: number;
	};
	artist: number;
	artistTypes: {
		album: number;
		compilation: number;
		audiobook: number;
	};
}
