import sharp from 'sharp';

export interface ImageInfo {
	width?: number;
	height?: number;
	format?: string;
}

export async function getImageInfo(filename: string): Promise<ImageInfo> {
	const meta = await sharp(filename).metadata();
	return {height: meta.height, width: meta.width, format: meta.format};
}
