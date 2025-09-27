export function extractAlbumName(name) {
    let result = name;
    const patterns = [
        /[([]([\d]{4})[)\]]/gi,
        /[([](cd\s*\d*)[)\]]/gi,
        /[([](disc\s*\d*)[)\]]/gi,
        /[([](disc\s*\d*:.*)[)\]]/gi,
        /[([](bonus.*)[)\]]/gi,
        /[([](.*(edition|retail))[)\]]/gi,
        /[([](\d+\s*cds?)[)\]]/gi,
        /[([](\d+\s*of\s*\d+)[)\]]/gi,
        /[([](ep|bootleg|deluxe|promo)[)\]]/gi,
        /[([](single|lp|retro|ost|uvs)[)\]]/gi,
        /[([](demp|demos|remix(es)?)[)\]]/gi,
        /[([](remaster(ed)?|live|vinyl)[)\]]/gi,
        /[([](collection|maxi)[)\]]/gi,
        /-\s*cd\d*/gi
    ];
    for (const pattern of patterns) {
        result = result.replace(pattern, '');
    }
    result = result.trim();
    if (result.length === 0) {
        return name.trim();
    }
    return result;
}
//# sourceMappingURL=album-name.js.map