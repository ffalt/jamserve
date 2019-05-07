// declare function archiver(format: archiver.Format, options?: archiver.ArchiverOptions): archiver.Archiver;

interface WaveformDataPoint {
	timeStamp: number;
	visible: boolean;
}

interface WaveDataResponse {
	readonly version: number;
	readonly sample_rate: number;
	readonly samples_per_pixel: number;
	readonly bits: number;
	readonly length: number;
	data: Array<number>;
}

interface WaveformDataAdapter {
	readonly version: number;
	readonly is_8_bit: boolean;
	readonly is_16_bit: boolean;
	readonly sample_rate: number;
	readonly scale: number;
	readonly length: number;
	data: WaveDataResponse;

	at(index: number): number;
}

declare class WaveformData {
	public readonly duration: number;
	public readonly offset_duration: number;
	public readonly pixels_per_second: number;
	public readonly seconds_per_pixel: number;
	public readonly adapter: WaveformDataAdapter;

	public static create(response_data: string | ArrayBuffer | WaveDataResponse): WaveformData;

	public resample(options: number | { width: number, scale?: number }): WaveformData;

	public offset(start: number, end: number): void;

	public set_segment(start: number, end: number, identifier?: string): void;

	public set_point(timeStamp: number, identifier?: string): WaveformDataPoint;

	public removePoint(identifier?: string): void;

	public at(index: number): number;

	public time(index: number): number;

	public at_time(time: number): number;

	public in_offset(pixel: number): number;

	public min_sample(offset: number): number;

	public max_sample(offset: number): number;
}

declare module 'waveform-data' {
	export = WaveformData;
}
