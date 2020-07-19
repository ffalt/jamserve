
export interface ImageResult {
	file?: { filename: string; name: string };
	json?: any;
	buffer?: {
		buffer: Buffer;
		contentType: string;
	};
	name?: string;
}
