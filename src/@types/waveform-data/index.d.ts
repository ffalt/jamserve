/**
 * types for https://github.com/bbc/waveform-data.js v3.0.0
 */

/** https://github.com/bbc/audiowaveform/blob/master/doc/DataFormat.md */
interface WaveDataResponse {
	/** The version number of the waveform data format. */
	version: number;
	/** The number of waveform channels present (version 2 only). */
	channels?: number;
	/** Sample rate of original audio file (Hz). */
	sample_rate: number;
	/** Number of audio samples per waveform minimum/maximum pair. */
	samples_per_pixel: number;
	/** Resolution of waveform data. May be either 8 or 16. */
	bits: number;
	/** Length of waveform data (number of minimum and maximum value pairs per channel). */
	length: number;
	/** Array of minimum and maximum waveform data points, interleaved. Depending on bits, each value may be in the range -128 to +127 or -32768 to +32727. */
	data: Array<number>;
}

interface WaveFormChannel {
	/** Returns the waveform minimum at the given index position. */
	min_sample(index: number): number;

	/** Returns the waveform maximum at the given index position. */
	max_sample(index: number): number;

	/** Returns all the waveform minimum values within the current offset, as an array. */
	min_array(): Array<number>;

	/** Returns all the waveform maximum values within the current offset, as an array. */
	max_array(): Array<number>;
}

declare class WaveformData {
	/** Returns the approximate duration of the audio file, in seconds. */
	public readonly duration: number;
	/** Returns the number of pixels per second. */
	public readonly pixels_per_second: number;
	/** Returns the amount of time (in seconds) represented by a single pixel. */
	public readonly seconds_per_pixel: number;
	/** Returns the sample rate of the original audio, in Hz. */
	public readonly sample_rate: number;
	/** Returns the number of waveform channels. */
	public readonly channels: number;
	/** Returns the number of audio samples per pixel of the waveform data. This gives an indication of the zoom level (higher numbers mean lower resolution, i.e., more zoomed out). */
	public readonly scale: number;
	/** Returns the length of the waveform data, in pixels. */
	public readonly length: number;

	public static create(response_data: string | ArrayBuffer | WaveDataResponse): WaveformData;

	/** Creates and returns a new WaveformData object with resampled data. Use this method to create waveform data at different zoom levels. */
	public resample(options: number | { width: number, scale?: number }): WaveformData;

	/** Returns a WaveformDataChannel object that provides access to the waveform data for the given channel index. */
	public channel(nr: number): WaveFormChannel;

	/** Returns the time in seconds for a given pixel index. */
	public time(index: number): number;

	/** Returns the pixel index for a given time. */
	public at_time(time: number): number;

}

declare module 'waveform-data' {
	export = WaveformData;
}
