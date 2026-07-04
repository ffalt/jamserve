export function sanitizeFilename(s) {
    return s.replaceAll(/["\\]/g, '_')
        .replaceAll(/[\u{0}-\u{1F}\u{7F}]/gu, '');
}
//# sourceMappingURL=saniitize-filename.js.map