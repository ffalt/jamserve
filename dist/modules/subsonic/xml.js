function xmlString(s) {
    return s
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll('\'', '&apos;');
}
function xmlContent(o) {
    for (const [key, value] of Object.entries(o)) {
        if (key === 'value') {
            return value;
        }
    }
    return '';
}
function xmlTag(key, value, parameter) {
    return (value.length === 0) ? `<${key}${parameter} />` : `<${key}${parameter}>${value}</${key}>`;
}
function xmlParameters(o) {
    const sl = [];
    for (const [key, sub] of Object.entries(o)) {
        if (key === 'value') {
            continue;
        }
        if (sub !== undefined && !Array.isArray(sub) && (typeof sub !== 'object')) {
            sl.push(` ${key}="${xmlString(sub.toString())}"`);
        }
    }
    return sl.join('');
}
function xmlObject(o) {
    const sl = [];
    for (const [key, sub] of Object.entries(o)) {
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
    for (const [key, element] of Object.entries(o)) {
        const value = xmlObject(element);
        sl.push(xmlTag(key, value, xmlParameters(element)));
    }
    return `<?xml version="1.0" encoding="UTF-8"?>${sl.join('')}`;
}
//# sourceMappingURL=xml.js.map