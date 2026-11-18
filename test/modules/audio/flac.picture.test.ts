import { describe, expect, test } from '@jest/globals';
import fse from 'fs-extra';
import path from 'node:path';
import sharp from 'sharp';
import { MetadataBlockPicture } from '../../../src/modules/audio/formats/flac/lib/block.picture.js';
import { Flac } from '../../../src/modules/audio/formats/flac/index.js';
import { AudioModuleFLAC } from '../../../src/modules/audio/formats/flac.module.js';
import { ImageModule } from '../../../src/modules/image/image.module.js';
import { mockImage } from '../../mock/mock.image.js';
import { MediaTagRaw } from '../../../src/entity/tag/tag.model.js';

describe('MetadataBlockPicture', () => {
	test('getSize returns the exact payload byte length matching publish', async () => {
		const { buffer, mime } = await mockImage('jpeg');
		const block = MetadataBlockPicture.createPictureBlock(3, mime, 'Front Cover', 360, 360, 24, 0, buffer);

		const expectedSize = block.getSize();
		const published = block.publish();

		// published buffer has 4-byte header + payload
		expect(published.length).toBe(expectedSize + 4);
		const header = published.readUInt32BE(0);
		const sizeInHeader = header & 0x00_FF_FF_FF;
		expect(sizeInHeader).toBe(expectedSize);
	});

	test('parse correctly extracts complete picture buffer without truncation', async () => {
		const { buffer, mime } = await mockImage('jpeg');
		const block = MetadataBlockPicture.createPictureBlock(3, mime, 'Front Cover', 360, 360, 24, 0, buffer);

		const published = block.publish();
		const payload = published.subarray(4);

		const parsedBlock = new MetadataBlockPicture(false);
		parsedBlock.parse(payload);

		expect(parsedBlock.hasData).toBe(true);
		expect(parsedBlock.pictureType).toBe(3);
		expect(parsedBlock.mimeType).toBe(mime);
		expect(parsedBlock.description).toBe('Front Cover');
		expect(parsedBlock.width).toBe(360);
		expect(parsedBlock.height).toBe(360);
		expect(parsedBlock.bitsPerPixel).toBe(24);
		expect(parsedBlock.colors).toBe(0);
		expect(parsedBlock.pictureData).toBeDefined();
		expect(parsedBlock.pictureData?.length).toBe(buffer.length);
		expect(parsedBlock.pictureData?.equals(buffer)).toBe(true);

		// Verifying with sharp ensures libvips can read the JPEG without premature end of image error
		const metadata = await sharp(parsedBlock.pictureData, { failOn: 'warning' }).metadata();
		expect(metadata.format).toBe('jpeg');
		expect(metadata.width).toBe(360);
		expect(metadata.height).toBe(360);
	});
});

describe('AudioModuleFLAC image embedding and extraction', () => {
	const testDir = path.resolve('local/__tests__/flac-picture');
	const sourceFlac = path.resolve('data/media/library/mu5/Kate Bush/1978 a - The Kick Inside/05 - The Man With The Child In His Eyes.flac');
	const testFlac = path.join(testDir, 'test-embed.flac');

	beforeEach(async () => {
		await fse.ensureDir(testDir);
		if (await fse.pathExists(sourceFlac)) {
			await fse.copy(sourceFlac, testFlac);
		}
	});

	afterEach(async () => {
		await fse.remove(testDir);
	});

	test('embeds a JPEG image and extracts it back as a valid readable JPEG image', async () => {
		if (!(await fse.pathExists(testFlac))) {
			return;
		}

		const imageModule = new ImageModule({} as any);
		const audioFlac = new AudioModuleFLAC(imageModule);

		const { buffer, mime } = await mockImage('jpeg');

		const rawTag: MediaTagRaw = {
			version: 4,
			frames: {
				TIT2: [{ id: 'TIT2', value: { text: 'Test Song' } }],
				APIC: [{
					id: 'APIC',
					value: {
						pictureType: 3,
						description: 'Cover',
						mimeType: mime,
						bin: buffer
					}
				}]
			}
		};

		await audioFlac.write(testFlac, rawTag);

		const flac = new Flac();
		const info = await flac.read(testFlac);

		expect(info.pictures).toBeDefined();
		expect(info.pictures?.length).toBeGreaterThan(0);

		const extracted = await audioFlac.extractTagImage(testFlac);
		expect(extracted).toBeDefined();
		expect(extracted?.length).toBe(buffer.length);
		expect(extracted?.equals(buffer)).toBe(true);

		const metadata = await sharp(extracted, { failOn: 'warning' }).metadata();
		expect(metadata.format).toBe('jpeg');
		expect(metadata.width).toBe(360);
		expect(metadata.height).toBe(360);
	});
});
