import { getMilliseconds, wait } from './clock.js';
export class TokenBucket {
    constructor({ bucketSize, tokensPerInterval, interval, parentBucket }) {
        this.bucketSize = bucketSize;
        this.tokensPerInterval = tokensPerInterval;
        if (typeof interval === 'string') {
            switch (interval) {
                case 'sec':
                case 'second':
                    this.interval = 1000;
                    break;
                case 'min':
                case 'minute':
                    this.interval = 1000 * 60;
                    break;
                case 'hr':
                case 'hour':
                    this.interval = 1000 * 60 * 60;
                    break;
                case 'day':
                    this.interval = 1000 * 60 * 60 * 24;
                    break;
                default:
                    throw new Error('Invalid interval ' + interval);
            }
        }
        else {
            this.interval = interval;
        }
        this.parentBucket = parentBucket;
        this.content = 0;
        this.lastDrip = getMilliseconds();
    }
    async removeTokens(count) {
        if (this.bucketSize === 0) {
            return Number.POSITIVE_INFINITY;
        }
        if (count > this.bucketSize) {
            throw new Error(`Requested tokens ${count} exceeds bucket size ${this.bucketSize}`);
        }
        this.drip();
        const comeBackLater = async () => {
            const waitMs = Math.ceil((count - this.content) * (this.interval / this.tokensPerInterval));
            await wait(waitMs);
            return this.removeTokens(count);
        };
        if (count > this.content)
            return comeBackLater();
        if (this.parentBucket != undefined) {
            const remainingTokens = await this.parentBucket.removeTokens(count);
            if (count > this.content)
                return comeBackLater();
            this.content -= count;
            return Math.min(remainingTokens, this.content);
        }
        else {
            this.content -= count;
            return this.content;
        }
    }
    tryRemoveTokens(count) {
        if (!this.bucketSize)
            return true;
        if (count > this.bucketSize)
            return false;
        this.drip();
        if (count > this.content)
            return false;
        if (this.parentBucket && !this.parentBucket.tryRemoveTokens(count))
            return false;
        this.content -= count;
        return true;
    }
    drip() {
        if (this.tokensPerInterval === 0) {
            const prevContent = this.content;
            this.content = this.bucketSize;
            return this.content > prevContent;
        }
        const now = getMilliseconds();
        const deltaMS = Math.max(now - this.lastDrip, 0);
        this.lastDrip = now;
        const dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
        const prevContent = this.content;
        this.content = Math.min(this.content + dripAmount, this.bucketSize);
        return Math.floor(this.content) > Math.floor(prevContent);
    }
}
//# sourceMappingURL=TokenBucket.js.map