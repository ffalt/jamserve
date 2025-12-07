// Minimal ambient shims for DOM/WebAudio types used only by dependency type definitions.
// These are intentionally lightweight and cover only the names to satisfy the compiler
// in a Node.js environment where full DOM lib is not available.

// ImageData is referenced by @types/d3-array, but we don't use those APIs in Node.
declare class ImageData {
	constructor(data: Uint8ClampedArray, width: number, height: number);
	readonly data: Uint8ClampedArray;
	readonly width: number;
	readonly height: number;
}

// Minimal Web Audio shims used by waveform-data typings.
// We only need the names to exist; runtime code does not instantiate these in Node.
declare class AudioContext {
	// no-op
}

declare class AudioBuffer {
	// no-op
}
