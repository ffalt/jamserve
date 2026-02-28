import { spawn } from 'node:child_process';
import { getBinPath } from '../../../utils/which.js';
import { logger } from '../../../utils/logger.js';
const log = logger('Ffmpeg');
export class FfmpegCommand extends EventTarget {
    constructor(options) {
        super();
        this.outputEnd = true;
        this.addedOptions = [];
        this.noVideo = false;
        this.listeners = new Map();
        this.source = options?.source;
    }
    on(eventName, callback) {
        const wrapped = (event) => {
            callback(event.detail);
        };
        this.addInternalListener(eventName, callback, wrapped, false);
        return this;
    }
    off(eventName, callback) {
        this.removeInternalListener(eventName, callback);
        return this;
    }
    once(eventName, callback) {
        const wrapped = (event) => {
            callback(event.detail);
        };
        this.addInternalListener(eventName, callback, wrapped, true);
        return this;
    }
    addInternalListener(eventName, key, listener, once) {
        let map = this.listeners.get(eventName);
        if (!map) {
            map = new Map();
            this.listeners.set(eventName, map);
        }
        map.set(key, listener);
        this.addEventListener(eventName, listener, { once });
    }
    removeInternalListener(eventName, key) {
        const map = this.listeners.get(eventName);
        if (!map)
            return;
        const listener = map.get(key);
        if (!listener)
            return;
        this.removeEventListener(eventName, listener);
        map.delete(key);
        if (map.size === 0)
            this.listeners.delete(eventName);
    }
    createEvent(name, detail) {
        if (typeof globalThis.CustomEvent === 'function') {
            return new CustomEvent(name, { detail });
        }
        class SimpleCustomEvent extends Event {
            constructor(type, init) {
                super(type);
                this.detail = init?.detail;
            }
        }
        return new SimpleCustomEvent(name, { detail });
    }
    emitEvent(name, detail) {
        if (name === 'error') {
            const hasErrorListener = this.listeners.has('error') && this.listeners.get('error').size > 0;
            if (!hasErrorListener) {
                log.errorMsg('Unhandled error:', detail);
            }
        }
        this.dispatchEvent(this.createEvent(name, detail));
    }
    addOption(key, value) {
        if (key)
            this.addedOptions.push(key);
        if (value !== undefined)
            this.addedOptions.push(value);
        return this;
    }
    addOptions(options) {
        this.addedOptions.push(...options);
        return this;
    }
    withNoVideo() {
        this.noVideo = true;
        return this;
    }
    withAudioCodec(codec) {
        this.audioCodec = codec;
        return this;
    }
    withAudioBitrate(br) {
        this.audioBitrate = br;
        return this;
    }
    toFormat(fmt) {
        this.formatName = fmt;
        return this;
    }
    format(fmt) {
        return this.toFormat(fmt);
    }
    output(file) {
        this.outputFile = file;
        return this;
    }
    save(file) {
        this.output(file);
        this.run();
        return this;
    }
    writeToStream(stream, options) {
        this.outputStream = stream;
        this.outputEnd = options?.end ?? true;
        if (this.child?.stdout) {
            this.child.stdout.pipe(this.outputStream, { end: this.outputEnd });
        }
        this.run();
        return stream;
    }
    async buildArgs() {
        const bin = await getBinPath('ffmpeg', 'FFMPEG_PATH');
        if (!bin) {
            const error = new Error('ffmpeg binary not found');
            error.code = 'ENOENT';
            throw error;
        }
        const arguments_ = ['-hide_banner'];
        let stdinPipe = false;
        let stdoutPipe = false;
        if (typeof this.source === 'string' && this.source.length > 0) {
            arguments_.push('-i', this.source);
        }
        else if (this.source) {
            arguments_.push('-i', 'pipe:0');
            stdinPipe = true;
        }
        if (this.noVideo)
            arguments_.push('-vn');
        if (this.audioCodec)
            arguments_.push('-c:a', this.audioCodec);
        if (this.audioBitrate)
            arguments_.push('-b:a', this.audioBitrate);
        if (this.formatName)
            arguments_.push('-f', this.formatName);
        if (this.addedOptions.length > 0) {
            for (const opt of this.addedOptions) {
                if (opt.includes(' ')) {
                    arguments_.push(...this.tokenizeOptionString(opt));
                }
                else {
                    arguments_.push(opt);
                }
            }
        }
        if (this.outputFile) {
            arguments_.push(this.outputFile);
        }
        else {
            arguments_.push('pipe:1');
            stdoutPipe = true;
        }
        return { bin, args: arguments_, stdinPipe, stdoutPipe };
    }
    run() {
        if (this.child)
            return this;
        void (async () => {
            try {
                const { bin, args, stdinPipe, stdoutPipe } = await this.buildArgs();
                this.emitEvent('start', [bin, ...args].join(' '));
                const child = spawn(bin, args);
                this.child = child;
                if (stdinPipe && this.source && typeof this.source !== 'string') {
                    this.source.pipe(child.stdin);
                }
                else {
                    child.stdin.end();
                }
                if (stdoutPipe && this.outputStream) {
                    child.stdout.pipe(this.outputStream, { end: this.outputEnd });
                }
                let stderr = '';
                child.stderr.on('data', (d) => {
                    stderr += d.toString();
                });
                child.on('error', error => {
                    this.emitEvent('error', error);
                });
                child.on('close', code => {
                    if (code === 0) {
                        this.emitEvent('end');
                    }
                    else {
                        const error = new Error(`ffmpeg exited with code ${code}: ${stderr}`);
                        this.emitEvent('error', error);
                    }
                });
            }
            catch (error) {
                this.emitEvent('error', error);
            }
        })();
        return this;
    }
    tokenizeOptionString(s) {
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
export default function ffmpeg(options) {
    return new FfmpegCommand(options);
}
//# sourceMappingURL=ffmpeg.js.map