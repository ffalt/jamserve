import fse from 'fs-extra';
import {ID3v2, IID3V2} from 'jamp3';

export async function writeMP3Track(filename: string, album: string, artist: string, trackNr: number): Promise<void> {
	const mp3stub = Buffer.from([255, 251, 176, 196, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 110, 102, 111, 0, 0, 0, 15, 0, 0, 0, 2, 0, 0, 7,
		87, 0, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128,
		128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 255, 255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 57]);
	await fse.writeFile(filename, mp3stub);
	const t: IID3V2.Tag = {
		id: 'ID3v2',
		start: 0,
		end: 0,
		frames: [
			{
				'id': 'TALB',
				'value': {
					'text': album
				}
			},
			{
				'id': 'TPE1',
				'value': {
					'text': artist
				}
			},
			{
				'id': 'TRCK',
				'value': {
					'text': trackNr.toString()
				}
			}
		]
	};
	const id3v2 = new ID3v2();
	await id3v2.write(filename, t, 4, 0);
}
