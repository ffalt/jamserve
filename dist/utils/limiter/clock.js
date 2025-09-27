function hrtime(previousTimestamp) {
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
export function getMilliseconds() {
    const [seconds, nanoseconds] = hrtime();
    return seconds * 1e3 + Math.floor(nanoseconds / 1e6);
}
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=clock.js.map