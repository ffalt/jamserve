import { TokenBucket } from "./TokenBucket.js";
import { getMilliseconds, wait } from "./clock.js";
export class RateLimiter {
    constructor({ tokensPerInterval, interval, fireImmediately }) {
        this.tokenBucket = new TokenBucket({
            bucketSize: tokensPerInterval,
            tokensPerInterval,
            interval,
        });
        this.tokenBucket.content = tokensPerInterval;
        this.curIntervalStart = getMilliseconds();
        this.tokensThisInterval = 0;
        this.fireImmediately = fireImmediately ?? false;
    }
    async removeTokens(count) {
        if (count > this.tokenBucket.bucketSize) {
            throw new Error(`Requested tokens ${count} exceeds maximum tokens per interval ${this.tokenBucket.bucketSize}`);
        }
        const now = getMilliseconds();
        if (now < this.curIntervalStart || now - this.curIntervalStart >= this.tokenBucket.interval) {
            this.curIntervalStart = now;
            this.tokensThisInterval = 0;
        }
        if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval) {
            if (this.fireImmediately) {
                return -1;
            }
            else {
                const waitMs = Math.ceil(this.curIntervalStart + this.tokenBucket.interval - now);
                await wait(waitMs);
                const remainingTokens = await this.tokenBucket.removeTokens(count);
                this.tokensThisInterval += count;
                return remainingTokens;
            }
        }
        const remainingTokens = await this.tokenBucket.removeTokens(count);
        this.tokensThisInterval += count;
        return remainingTokens;
    }
    tryRemoveTokens(count) {
        if (count > this.tokenBucket.bucketSize)
            return false;
        const now = getMilliseconds();
        if (now < this.curIntervalStart || now - this.curIntervalStart >= this.tokenBucket.interval) {
            this.curIntervalStart = now;
            this.tokensThisInterval = 0;
        }
        if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval)
            return false;
        const removed = this.tokenBucket.tryRemoveTokens(count);
        if (removed) {
            this.tokensThisInterval += count;
        }
        return removed;
    }
    getTokensRemaining() {
        this.tokenBucket.drip();
        return this.tokenBucket.content;
    }
}
//# sourceMappingURL=RateLimiter.js.map