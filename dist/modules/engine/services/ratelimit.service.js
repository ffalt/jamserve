var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { RateLimiterMemory } from 'rate-limiter-flexible';
function getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits) {
    if (countConsecutiveOutOfLimits <= 1) {
        return 1;
    }
    return getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 1) + getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 2);
}
let RateLimitService = class RateLimitService {
    constructor() {
        this.loginLimiterOption = {
            points: 5,
            duration: 15 * 60,
            keyPrefix: 'login'
        };
        this.loginLimiter = new RateLimiterMemory(this.loginLimiterOption);
        this.limiterConsecutiveOutOfLimits = new RateLimiterMemory({
            keyPrefix: 'login_consecutive_outoflimits',
            points: 99999,
            duration: 0
        });
    }
    async loginSlowDown(req, res) {
        const key = req.ip;
        try {
            const resConsume = await this.loginLimiter.consume(key);
            if (resConsume.remainingPoints <= 0) {
                const resPenalty = await this.limiterConsecutiveOutOfLimits.penalty(key);
                await this.loginLimiter.block(key, 60 * getFibonacciBlockDurationMinutes(resPenalty.consumedPoints));
            }
            res.set('X-RateLimit-Limit', `${this.loginLimiterOption.points}`);
            res.set('X-RateLimit-Remaining', `${resConsume.remainingPoints}`);
            return false;
        }
        catch (rlRejected) {
            if (rlRejected instanceof Error) {
                throw rlRejected;
            }
            else {
                const seconds = Math.round(rlRejected.msBeforeNext / 1000) || 1;
                res.set('Retry-After', `${seconds}`);
                res.status(429).send(`Too Many Requests, try again in ${seconds} seconds`);
                return true;
            }
        }
    }
    async loginSlowDownReset(req) {
        const key = req.ip;
        await this.limiterConsecutiveOutOfLimits.delete(key);
        await this.loginLimiter.delete(key);
    }
};
RateLimitService = __decorate([
    InRequestScope
], RateLimitService);
export { RateLimitService };
//# sourceMappingURL=ratelimit.service.js.map