export function hexDecode(hex) {
    if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) {
        return '';
    }
    let result = '';
    for (let index = 0; index < hex.length; index += 2) {
        result += String.fromCodePoint(Number.parseInt(hex.slice(index, index + 2), 16));
    }
    return result.trim();
}
//# sourceMappingURL=hex-decode.js.map