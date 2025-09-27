import crypto from 'node:crypto';
export function shuffle(list) {
    for (let index = list.length - 1; index > 0; index--) {
        const pos = Math.floor(Math.random() * (index + 1));
        [list[index], list[pos]] = [list[pos], list[index]];
    }
    return list;
}
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomItems(list, amount) {
    if (amount === undefined || amount < 0 || list.length <= amount) {
        return shuffle(list);
    }
    const result = [];
    const done = [];
    while ((result.length < amount)) {
        const index = randomInt(0, list.length - 1);
        if (!done.includes(index)) {
            result.push(list[index]);
            done.push(index);
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