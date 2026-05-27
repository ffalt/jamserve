export function sanitizeFilename(s) {
    return s.replaceAll(/["\\]/g, '_')
        .replaceAll(/[\u0000-\u001F\u007F]/g, '');
}
//# sourceMappingURL=saniitize-filename.js.map