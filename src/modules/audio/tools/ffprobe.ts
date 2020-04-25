import {spawnToolJson} from '../../../utils/tool';

export interface ProbeResult {
	format: {
		filename: string;
		nb_streams: number;
		nb_programs: number;
		format_name: string; // 'mp3',
		format_long_name: string; // 'MP2/3 (MPEG audio layer 2/3)',
		start_time: string; // '0.000000',
		duration: string; // '662.499375',
		size: string; // '10600329',
		bit_rate: string; // '128004',
		probe_score: number;
		tags: { [name: string]: string };
	};
	frames?: Array<{
		media_type: string; //  'audio',
		stream_index: number; // 0,
		key_frame: number; // 1,
		pkt_pts: number; // 0,
		pkt_pts_time: string; //  '0.000000',
		pkt_dts: number; // 0,
		pkt_dts_time: string; //  '0.000000',
		best_effort_timestamp: number; // 0,
		best_effort_timestamp_time: string; //  '0.000000',
		pkt_duration: number; // 508032,
		pkt_duration_time: string; //  '0.036000',
		pkt_pos: string; // '0',
		pkt_size: string; // '288',
		sample_fmt: string; //  'fltp',
		nb_samples: number; // 1152,
		channels: number; // 1,
		channel_layout: string; //  'mono'
	}>;
	streams?: Array<{
		index: number;
		width: number;
		height: number;
		codec_name: string;
		codec_long_name: string;
		codec_type: string;
		codec_time_base: string; // '1/44100',
		codec_tag_string: string; //  '[0][0][0][0]',
		mode: string;
		channels: number;
		bits_per_sample: number;
		codec_tag: string; //  '0x0000',
		sample_fmt: string; //  'fltp',
		sample_rate: string; //  '44100',
		channel_layout: string; //  'stereo',
		r_frame_rate: string; // '0/0',
		avg_frame_rate: string; // '0/0',
		time_base: string; // '1/14112000',
		nb_read_frames: string; // "10020";
		start_pts: number;
		start_time: string;
		duration_ts: number;
		duration: string;
		bit_rate: string;
		disposition?: {
			default: number;
			dub: number;
			original: number;
			comment: number;
			lyrics: number;
			karaoke: number;
			forced: number;
			hearing_impaired: number;
			visual_impaired: number;
			clean_effects: number;
			attached_pic: number;
			timed_thumbnails: number;
		};
		side_data_list?: Array<{
			side_data_type: string; // 'Replay Gain'
		}>;
	}>;
}

export async function probe(filename: string, cmds: Array<string>): Promise<ProbeResult> {
	return spawnToolJson<ProbeResult>('ffprobe', 'FFPROBE_PATH', ['-print_format', 'json', '-show_error', '-show_streams', '-show_format', ...cmds, filename]);
}
