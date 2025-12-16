import type { Readable, Writable } from 'node:stream';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { getBinPath } from '../../../utils/which.js';

export interface FfmpegCommandOptions {
	source?: string | Readable;
}

type ListenerMap = Map<string, Map<Function, EventListener>>;

export class FfmpegCommand extends EventTarget {
	private source?: string | Readable;
	private outputFile?: string;
	private outputStream?: Writable;
	private outputEnd: boolean = true; // whether to end the destination stream when ffmpeg stdout ends
	private addedOptions: Array<string> = [];
	private noVideo = false;
	private audioCodec?: string;
	private audioBitrate?: string;
	private formatName?: string;
	private child?: ChildProcessWithoutNullStreams;
	private listeners: ListenerMap = new Map();

	constructor(options?: FfmpegCommandOptions) {
		super();
		this.source = options?.source;
	}

	/* Event helper methods: on / off / once
	   - on(event, cb): cb receives the event detail
	   - off(event, cb): removes listener
	   - once(event, cb): registers a one-time listener
	*/
	on(eventName: string, callback: (payload?: any) => void): this {
		const wrapped = (event: Event) => {
			callback((event as any).detail);
		};
		this.addInternalListener(eventName, callback, wrapped, false);
		return this;
	}

	off(eventName: string, callback: (payload?: any) => void): this {
		this.removeInternalListener(eventName, callback);
		return this;
	}

	once(eventName: string, callback: (payload?: any) => void): this {
		const wrapped = (event: Event) => {
			callback((event as any).detail);
		};
		this.addInternalListener(eventName, callback, wrapped, true);
		return this;
	}

	private addInternalListener(eventName: string, key: Function, listener: EventListener, once: boolean) {
		let map = this.listeners.get(eventName);
		if (!map) {
			map = new Map();
			this.listeners.set(eventName, map);
		}
		// store the mapping so off() can remove the correct wrapped listener
		map.set(key, listener);
		this.addEventListener(eventName, listener, { once });
	}

	private removeInternalListener(eventName: string, key: Function) {
		const map = this.listeners.get(eventName);
		if (!map) return;
		const listener = map.get(key);
		if (!listener) return;
		this.removeEventListener(eventName, listener);
		map.delete(key);
		if (map.size === 0) this.listeners.delete(eventName);
	}

	private createEvent(name: string, detail?: any): Event {
		if (typeof (globalThis as any).CustomEvent === 'function') {
			return new CustomEvent(name, { detail }) as unknown as Event;
		}
		class SimpleCustomEvent extends Event {
			detail: any;
			constructor(type: string, init?: { detail?: any }) {
				super(type);
				this.detail = init?.detail;
			}
		}
		return new SimpleCustomEvent(name, { detail });
	}

	private emitEvent(name: string, detail?: any) {
		this.dispatchEvent(this.createEvent(name, detail));
	}

	addOption(key: string, value?: string): this {
		if (key) this.addedOptions.push(key);
		if (value !== undefined) this.addedOptions.push(value);
		return this;
	}

	addOptions(options: Array<string>): this {
		this.addedOptions.push(...options);
		return this;
	}

	withNoVideo(): this {
		this.noVideo = true;
		return this;
	}

	withAudioCodec(codec: string): this {
		this.audioCodec = codec;
		return this;
	}

	withAudioBitrate(br: string): this {
		this.audioBitrate = br;
		return this;
	}

	toFormat(fmt: string): this {
		this.formatName = fmt;
		return this;
	}

	format(fmt: string): this {
		return this.toFormat(fmt);
	}

	output(file: string): this {
		this.outputFile = file;
		return this;
	}

	save(file: string): this {
		this.output(file);
		this.run();
		return this;
	}

	// Support passing an options object to control whether the destination stream
	// should be ended when ffmpeg stdout ends. Default: end = true.
	writeToStream(stream: Writable, options?: { end?: boolean }): Writable {
		this.outputStream = stream;
		this.outputEnd = options?.end ?? true;
		// If process already running and stdout exists, pipe immediately
		if (this.child?.stdout) {
			this.child.stdout.pipe(this.outputStream, { end: this.outputEnd });
		}
		this.run();
		return stream;
	}

	private async buildArgs(): Promise<{ bin: string; args: Array<string>; stdinPipe: boolean; stdoutPipe: boolean }> {
		const bin = await getBinPath('ffmpeg', 'FFMPEG_PATH');
		if (!bin) {
			const error: NodeJS.ErrnoException = new Error('ffmpeg binary not found');
			error.code = 'ENOENT';
			throw error;
		}
		const arguments_: Array<string> = ['-hide_banner'];

		let stdinPipe = false;
		let stdoutPipe = false;

		if (typeof this.source === 'string' && this.source.length > 0) {
			arguments_.push('-i', this.source);
		} else if (this.source) {
			arguments_.push('-i', 'pipe:0');
			stdinPipe = true;
		}

		if (this.noVideo) arguments_.push('-vn');
		if (this.audioCodec) arguments_.push('-c:a', this.audioCodec);
		if (this.audioBitrate) arguments_.push('-b:a', this.audioBitrate);
		if (this.formatName) arguments_.push('-f', this.formatName);

		if (this.addedOptions.length > 0) {
			for (const opt of this.addedOptions) {
				if (opt.includes(' ')) {
					arguments_.push(...this.tokenizeOptionString(opt));
				} else {
					arguments_.push(opt);
				}
			}
		}

		if (this.outputFile) {
			arguments_.push(this.outputFile);
		} else {
			arguments_.push('pipe:1');
			stdoutPipe = true;
		}

		return { bin, args: arguments_, stdinPipe, stdoutPipe };
	}

	run(): this {
		if (this.child) return this; // already running

		void (async () => {
			try {
				const { bin, args, stdinPipe, stdoutPipe } = await this.buildArgs();
				this.emitEvent('start', [bin, ...args].join(' '));
				const child = spawn(bin, args);
				this.child = child;

				if (stdinPipe && this.source && typeof this.source !== 'string') {
					this.source.pipe(child.stdin);
				} else {
					// No stdin input
					child.stdin.end();
				}

				if (stdoutPipe && this.outputStream) {
					child.stdout.pipe(this.outputStream, { end: this.outputEnd });
				}

				let stderr = '';
				child.stderr.on('data', (d: Buffer) => {
					stderr += d.toString();
				});

				child.on('error', error => {
					this.emitEvent('error', error);
				});

				child.on('close', code => {
					if (code === 0) {
						this.emitEvent('end');
					} else {
						const error = new Error(`ffmpeg exited with code ${code}: ${stderr}`);
						this.emitEvent('error', error);
					}
				});
			} catch (error) {
				this.emitEvent('error', error);
			}
		})();

		return this;
	}

	// Split an option string into tokens, respecting quoted substrings.
	private tokenizeOptionString(s: string): Array<string> {
		// Match groups of non-space characters or quoted strings
		const re = /(?:[^\s"]+|"[^"]*")+/g;
		const matches = s.match(re) ?? [];
		return matches.map(tok => {
			if (tok.startsWith('"') && tok.endsWith('"')) {
				return tok.slice(1, -1);
			}
			return tok;
		});
	}
}

export default function ffmpeg(options?: FfmpegCommandOptions): FfmpegCommand {
	return new FfmpegCommand(options);
}
