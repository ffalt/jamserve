import dns from 'node:dns/promises';
import net from 'node:net';

/**
 * Private and reserved IPv4/IPv6 CIDR ranges that must be blocked
 * to prevent SSRF attacks against internal infrastructure.
 */
const BLOCKED_IPV4_RANGES: Array<{ prefix: number; mask: number }> = [
	// 0.0.0.0/8        — Current network
	{ prefix: 0x00_00_00_00, mask: 0xFF_00_00_00 },
	// 10.0.0.0/8       — Private (RFC 1918)
	{ prefix: 0x0A_00_00_00, mask: 0xFF_00_00_00 },
	// 100.64.0.0/10    — Shared address space (RFC 6598)
	{ prefix: 0x64_40_00_00, mask: 0xFF_C0_00_00 },
	// 127.0.0.0/8      — Loopback
	{ prefix: 0x7F_00_00_00, mask: 0xFF_00_00_00 },
	// 169.254.0.0/16   — Link-local
	{ prefix: 0xA9_FE_00_00, mask: 0xFF_FF_00_00 },
	// 172.16.0.0/12    — Private (RFC 1918)
	{ prefix: 0xAC_10_00_00, mask: 0xFF_F0_00_00 },
	// 192.0.0.0/24     — IETF Protocol Assignments
	{ prefix: 0xC0_00_00_00, mask: 0xFF_FF_FF_00 },
	// 192.0.2.0/24     — TEST-NET-1
	{ prefix: 0xC0_00_02_00, mask: 0xFF_FF_FF_00 },
	// 192.88.99.0/24   — 6to4 relay anycast (deprecated)
	{ prefix: 0xC0_58_63_00, mask: 0xFF_FF_FF_00 },
	// 192.168.0.0/16   — Private (RFC 1918)
	{ prefix: 0xC0_A8_00_00, mask: 0xFF_FF_00_00 },
	// 198.18.0.0/15    — Benchmarking
	{ prefix: 0xC6_12_00_00, mask: 0xFF_FE_00_00 },
	// 198.51.100.0/24  — TEST-NET-2
	{ prefix: 0xC6_33_64_00, mask: 0xFF_FF_FF_00 },
	// 203.0.113.0/24   — TEST-NET-3
	{ prefix: 0xCB_00_71_00, mask: 0xFF_FF_FF_00 },
	// 224.0.0.0/4      — Multicast
	{ prefix: 0xE0_00_00_00, mask: 0xF0_00_00_00 },
	// 240.0.0.0/4      — Reserved for future use
	{ prefix: 0xF0_00_00_00, mask: 0xF0_00_00_00 }
];

function ipv4ToInt(ip: string): number {
	const parts = ip.split('.').map(Number);
	// >>> 0 coerces to unsigned 32-bit; without it, IPs >= 128.0.0.0 produce negative values
	const signed = ((parts.at(0)! << 24) | (parts.at(1)! << 16) | (parts.at(2)! << 8) | parts.at(3)!);
	return signed >>> 0;
}

function isBlockedIPv4(ip: string): boolean {
	const addr = ipv4ToInt(ip);
	// >>> 0 coerces bitwise AND result to unsigned 32-bit for correct comparison with unsigned prefix
	return BLOCKED_IPV4_RANGES.some(range => {
		const masked = (addr & range.mask) >>> 0;
		return masked === range.prefix;
	});
}

function isBlockedIPv6(ip: string): boolean {
	const normalized = ip.toLowerCase();
	// Loopback
	if (normalized === '::1' || normalized === '0000:0000:0000:0000:0000:0000:0000:0001') {
		return true;
	}
	// Unspecified
	if (normalized === '::' || normalized === '0000:0000:0000:0000:0000:0000:0000:0000') {
		return true;
	}
	// IPv4-mapped IPv6  (::ffff:x.x.x.x)
	const v4MappedMatch = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.exec(normalized);
	if (v4MappedMatch) {
		return isBlockedIPv4(v4MappedMatch.at(1)!);
	}
	// Link-local (fe80::/10)
	if (normalized.startsWith('fe80:') || normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) {
		return true;
	}
	// Unique local address (fc00::/7)
	return normalized.startsWith('fc') || normalized.startsWith('fd');
}

function isBlockedIP(ip: string): boolean {
	if (net.isIPv4(ip)) {
		return isBlockedIPv4(ip);
	}
	if (net.isIPv6(ip)) {
		return isBlockedIPv6(ip);
	}
	return false;
}

/**
 * Validates that a URL is safe for server-side fetching.
 * Blocks private/internal IP ranges, non-HTTP(S) schemes, and
 * hostnames that resolve to private addresses (DNS rebinding protection).
 *
 * @throws Error if the URL targets a blocked resource
 */
export async function validateExternalUrl(url: string): Promise<void> {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error('Invalid URL');
	}

	// Only allow http and https
	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		throw new Error(`Blocked URL scheme: ${parsed.protocol}`);
	}

	const hostname = parsed.hostname;

	// If the hostname is already an IP literal, check it directly
	if (net.isIP(hostname)) {
		if (isBlockedIP(hostname)) {
			throw new Error('URL targets a blocked network address');
		}
		return;
	}

	// Resolve the hostname and check all resulting addresses
	let addresses: Array<string>;
	try {
		const results = await dns.lookup(hostname, { all: true });
		addresses = results.map(r => r.address);
	} catch {
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
