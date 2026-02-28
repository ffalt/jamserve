import crypto from 'node:crypto';
export function shuffle(list) {
    for (let index = list.length - 1; index > 0; index--) {
        const pos = crypto.randomInt(index + 1);
        [list[index], list[pos]] = [list[pos], list[index]];
    }
    return list;
}
export function randomInt(min, max) {
    return crypto.randomInt(min, max + 1);
}
export function randomItems(list, amount) {
    if (amount === undefined || amount < 0 || list.length <= amount) {
        return shuffle(list);
    }
    const copy = [...list];
    for (let index = 0; index < amount; index++) {
        const pos = crypto.randomInt(index, copy.length);
        [copy[index], copy[pos]] = [copy[pos], copy[index]];
    }
    return copy.slice(0, amount);
}
export function randomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}
//# sourceMappingURL=random.js.map