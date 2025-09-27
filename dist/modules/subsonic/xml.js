function xmlString(s) {
    return s
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll('\'', '&apos;');
}
function xmlContent(o) {
    for (const key of Object.keys(o)) {
        if (key === 'value') {
            return o[key];
        }
    }
    return '';
}
function xmlTag(key, value, parameter) {
    return (value.length === 0) ? `<${key}${parameter} />` : `<${key}${parameter}>${value}</${key}>`;
}
function xmlParameters(o) {
    const sl = [];
    for (const key of Object.keys(o)) {
        if ((key !== 'value')) {
            const sub = o[key];
            if (sub !== undefined && !Array.isArray(sub) && (typeof sub !== 'object')) {
                sl.push(` ${key}="${xmlString(sub.toString())}"`);
            }
        }
    }
    return sl.join('');
}
function xmlObject(o) {
    const sl = [];
    for (const key of Object.keys(o)) {
        const sub = o[key];
        if (Array.isArray(sub)) {
            for (const entry of sub) {
                const value = xmlContent(entry) + xmlObject(entry);
                sl.push(xmlTag(key, value, xmlParameters(entry)));
            }
        }
        else if (typeof sub === 'object') {
            const value = xmlObject(sub);
            sl.push(xmlTag(key, value, xmlParameters(sub)));
        }
    }
    return sl.join('');
}
export function xml(o) {
    const sl = [];
    for (const key of Object.keys(o)) {
        const element = o[key];
        const value = xmlObject(element);
        sl.push(xmlTag(key, value, xmlParameters(element)));
    }
    return `<?xml version="1.0" encoding="UTF-8"?>${sl.join('')}`;
}
//# sourceMappingURL=xml.js.map