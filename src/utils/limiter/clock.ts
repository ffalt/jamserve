// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp?: [number, number]): [number, number] {
	const clocktime = Date.now() * 1e-3;
	let seconds = Math.floor(clocktime);
	let nanoSeconds = Math.floor((clocktime % 1) * 1e9);
	const previousSeconds = previousTimestamp?.at(0);
	const previousNanoSeconds = previousTimestamp?.at(1);
	if (previousSeconds !== undefined && previousNanoSeconds !== undefined) {
		seconds = seconds - previousSeconds;
		nanoSeconds = nanoSeconds - previousNanoSeconds;
		if (nanoSeconds < 0) {
			seconds--;
			nanoSeconds += 1e9;
		}
	}
	return [seconds, nanoSeconds];
}

// The current timestamp in whole milliseconds
export function getMilliseconds(): number {
	const [seconds, nanoseconds] = hrtime();
	return seconds * 1e3 + Math.floor(nanoseconds / 1e6);
}

// Wait for a specified number of milliseconds before fulfilling the returned promise.
export function wait(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}
