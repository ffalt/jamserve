import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { jest } from '@jest/globals';
import { StreamService } from '../../../src/entity/stream/stream.service.js';
import { LiveTranscoderStream } from '../../../src/modules/audio/transcoder/transcoder-live-stream.js';
import { AudioFormatType } from '../../../src/types/enums.js';

const TMPDIR = path.join(os.tmpdir(), 'jamserve-stream-svc');
let tempFile: string;

beforeAll(async () => {
	await fs.promises.mkdir(TMPDIR, { recursive: true });
	tempFile = path.join(TMPDIR, 'test.mp3');
	await fs.promises.writeFile(tempFile, Buffer.alloc(100));
});

const cachedResult = { file: { filename: 'cached.mp3', name: 'id.mp3' } };

interface MockTranscoder {
	get: ReturnType<typeof jest.fn>;
	getLive: ReturnType<typeof jest.fn>;
	clearCacheByIDs: ReturnType<typeof jest.fn>;
}

function makeMockTranscoder(getLiveMock?: ReturnType<typeof jest.fn>): MockTranscoder {
	return {
		get: jest.fn().mockResolvedValue(cachedResult as never),
		getLive: getLiveMock ?? jest.fn().mockReturnValue(new LiveTranscoderStream('', 'mp3', 128) as never),
		clearCacheByIDs: jest.fn()
	};
}

function makeService(getLiveMock?: ReturnType<typeof jest.fn>): { service: StreamService; transcoder: MockTranscoder } {
	const service = new StreamService();
	const transcoder = makeMockTranscoder(getLiveMock);
	(service as any).audioModule = { transcoder };
	return { service, transcoder };
}

describe('StreamService.streamFile', () => {
	test('rejects when file does not exist', async () => {
		const { service } = makeService();
		await expect(service.streamFile('/nonexistent/file.mp3', 'id1', 'mp3')).rejects.toThrow('File not found');
	});

	test('returns file result when no transcoding needed (same format, no bitrate)', async () => {
		const { service, transcoder } = makeService();
		const result = await service.streamFile(tempFile, 'myid', AudioFormatType.mp3, { format: AudioFormatType.mp3 });
		expect(result.file).toBeDefined();
		expect(result.file!.filename).toBe(tempFile);
		expect(result.file!.name).toBe('myid.mp3');
		expect(transcoder.get).not.toHaveBeenCalled();
		expect(transcoder.getLive).not.toHaveBeenCalled();
	});

	test('returns file result for raw format', async () => {
		const { service, transcoder } = makeService();
		const result = await service.streamFile(tempFile, 'myid', AudioFormatType.mp3, { format: 'raw' });
		expect(result.file).toBeDefined();
		expect(result.file!.filename).toBe(tempFile);
		expect(result.file!.name).toBe('myid.raw');
		expect(transcoder.get).not.toHaveBeenCalled();
	});

	test('strips leading dot from format', async () => {
		const { service } = makeService();
		const result = await service.streamFile(tempFile, 'myid', AudioFormatType.mp3, { format: '.mp3' });
		expect(result.file!.name).toBe('myid.mp3');
	});

	test('uses cached transcoder when transcoding is needed', async () => {
		const { service, transcoder } = makeService();
		const result = await service.streamFile(tempFile, 'myid', AudioFormatType.mp3, { format: AudioFormatType.ogg });
		expect(transcoder.get).toHaveBeenCalledWith(tempFile, 'myid', AudioFormatType.ogg, 0);
		expect(result.file).toBeDefined();
		expect(result.pipe).toBeUndefined();
	});

	test('uses cached transcoder when bitrate is set for same format', async () => {
		const { service, transcoder } = makeService();
		await service.streamFile(tempFile, 'myid', AudioFormatType.mp3, { format: AudioFormatType.mp3, maxBitRate: 128 });
		expect(transcoder.get).toHaveBeenCalledWith(tempFile, 'myid', AudioFormatType.mp3, 128);
	});

	test('caps webma maxBitRate at 256', async () => {
		const { service, transcoder } = makeService();
		await service.streamFile(tempFile, 'myid', 'mp3', { format: AudioFormatType.webma, maxBitRate: 320 });
		expect(transcoder.get).toHaveBeenCalledWith(tempFile, 'myid', AudioFormatType.webma, 256);
	});

	test('returns live stream pipe when timeOffset is set and transcoding is needed', async () => {
		const liveStream = new LiveTranscoderStream('', 'ogg', 128, 30);
		const { service, transcoder } = makeService(jest.fn().mockReturnValue(liveStream as never));
		const result = await service.streamFile(tempFile, 'myid', AudioFormatType.mp3, {
			format: AudioFormatType.ogg,
			timeOffset: 30
		});
		expect(transcoder.getLive).toHaveBeenCalledWith(tempFile, AudioFormatType.ogg, 0, 30);
		expect(transcoder.get).not.toHaveBeenCalled();
		expect(result.pipe).toBe(liveStream);
		expect(result.file).toBeUndefined();
	});

	test('returns live stream pipe when timeOffset is set but no transcoding needed', async () => {
		const liveStream = new LiveTranscoderStream('', 'mp3', 128, 15);
		const { service, transcoder } = makeService(jest.fn().mockReturnValue(liveStream as never));
		const result = await service.streamFile(tempFile, 'myid', AudioFormatType.mp3, {
			format: AudioFormatType.mp3,
			timeOffset: 15
		});
		expect(transcoder.getLive).toHaveBeenCalledWith(tempFile, AudioFormatType.mp3, 0, 15);
		expect(transcoder.get).not.toHaveBeenCalled();
		expect(result.pipe).toBe(liveStream);
	});

	test('uses source format for raw format with timeOffset', async () => {
		const liveStream = new LiveTranscoderStream('', 'mp3', 128, 10);
		const { service, transcoder } = makeService(jest.fn().mockReturnValue(liveStream as never));
		const result = await service.streamFile(tempFile, 'myid', AudioFormatType.mp3, {
			format: 'raw',
			timeOffset: 10
		});
		expect(transcoder.getLive).toHaveBeenCalledWith(tempFile, AudioFormatType.mp3, 0, 10);
		expect(result.pipe).toBe(liveStream);
	});

	test('ignores timeOffset of zero (returns file result)', async () => {
		const { service, transcoder } = makeService();
		const result = await service.streamFile(tempFile, 'myid', AudioFormatType.mp3, {
			format: AudioFormatType.mp3,
			timeOffset: 0
		});
		expect(transcoder.getLive).not.toHaveBeenCalled();
		expect(result.file).toBeDefined();
	});

	test('defaults to mp3 format when no format option given', async () => {
		const { service, transcoder } = makeService();
		// tempFile is an mp3 — same format → no transcode → file result
		const result = await service.streamFile(tempFile, 'myid', AudioFormatType.mp3);
		expect(result.file!.name).toBe('myid.mp3');
		expect(transcoder.get).not.toHaveBeenCalled();
	});
});
