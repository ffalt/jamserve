import crypto from 'crypto';
export function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomItem(list) {
    const i = randomInt(0, list.length - 1);
    return list[i];
}
export function randomItems(list, amount) {
    if (amount === undefined || amount < 0 || list.length <= amount) {
        return shuffle(list);
    }
    const result = [];
    const done = [];
    while ((result.length < amount)) {
        const i = randomInt(0, list.length - 1);
        if (!done.includes(i)) {
            result.push(list[i]);
            done.push(i);
        }
    }
    return result;
}
export function randomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}
//# sourceMappingURL=random.js.map