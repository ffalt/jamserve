import dns from 'node:dns/promises';
import net from 'node:net';
const BLOCKED_IPV4_RANGES = [
    { prefix: 0, mask: 4278190080 },
    { prefix: 167772160, mask: 4278190080 },
    { prefix: 1681915904, mask: 4290772992 },
    { prefix: 2130706432, mask: 4278190080 },
    { prefix: 2851995648, mask: 4294901760 },
    { prefix: 2886729728, mask: 4293918720 },
    { prefix: 3221225472, mask: 4294967040 },
    { prefix: 3221225984, mask: 4294967040 },
    { prefix: 3227017984, mask: 4294967040 },
    { prefix: 3232235520, mask: 4294901760 },
    { prefix: 3323068416, mask: 4294836224 },
    { prefix: 3325256704, mask: 4294967040 },
    { prefix: 3405803776, mask: 4294967040 },
    { prefix: 3758096384, mask: 4026531840 },
    { prefix: 4026531840, mask: 4026531840 }
];
function ipv4ToInt(ip) {
    const parts = ip.split('.').map(Number);
    const signed = ((parts.at(0) << 24) | (parts.at(1) << 16) | (parts.at(2) << 8) | parts.at(3));
    return signed >>> 0;
}
function isBlockedIPv4(ip) {
    const addr = ipv4ToInt(ip);
    return BLOCKED_IPV4_RANGES.some(range => {
        const masked = (addr & range.mask) >>> 0;
        return masked === range.prefix;
    });
}
function isBlockedIPv6(ip) {
    const normalized = ip.toLowerCase();
    if (normalized === '::1' || normalized === '0000:0000:0000:0000:0000:0000:0000:0001') {
        return true;
    }
    if (normalized === '::' || normalized === '0000:0000:0000:0000:0000:0000:0000:0000') {
        return true;
    }
    const v4MappedMatch = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.exec(normalized);
    if (v4MappedMatch) {
        return isBlockedIPv4(v4MappedMatch.at(1));
    }
    if (normalized.startsWith('fe80:') || normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) {
        return true;
    }
    return normalized.startsWith('fc') || normalized.startsWith('fd');
}
function isBlockedIP(ip) {
    if (net.isIPv4(ip)) {
        return isBlockedIPv4(ip);
    }
    if (net.isIPv6(ip)) {
        return isBlockedIPv6(ip);
    }
    return false;
}
export async function validateExternalUrl(url) {
    if (url.trim().length === 0) {
        throw new Error('Invalid URL');
    }
    let parsed;
    try {
        parsed = new URL(url);
    }
    catch {
        throw new Error('Invalid URL');
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error(`Blocked URL scheme: ${parsed.protocol}`);
    }
    const hostname = parsed.hostname;
    if (net.isIP(hostname)) {
        if (isBlockedIP(hostname)) {
            throw new Error('URL targets a blocked network address');
        }
        return;
    }
    let addresses;
    try {
        const results = await dns.lookup(hostname, { all: true });
        addresses = results.map(r => r.address);
    }
    catch {
        throw new Error(`Failed to resolve hostname: ${hostname}`);
    }
    if (addresses.length === 0) {
        throw new Error(`Failed to resolve hostname: ${hostname}`);
    }
    for (const address of addresses) {
        if (isBlockedIP(address)) {
            throw new Error('URL resolves to a blocked network address');
        }
    }
}
//# sourceMappingURL=url-check.js.map