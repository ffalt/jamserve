"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
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
        this.loginLimiter = new rate_limiter_flexible_1.RateLimiterMemory(this.loginLimiterOption);
        this.limiterConsecutiveOutOfLimits = new rate_limiter_flexible_1.RateLimiterMemory({
            keyPrefix: 'login_consecutive_outoflimits',
            points: 99999,
            duration: 0,
        });
    }
    getReqID(req) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        return Array.isArray(ip) ? ip[0] : ip;
    }
    async loginSlowDown(req, res) {
        const key = this.getReqID(req);
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
        const key = this.getReqID(req);
        await this.limiterConsecutiveOutOfLimits.delete(key);
        await this.loginLimiter.delete(key);
    }
};
RateLimitService = __decorate([
    typescript_ioc_1.InRequestScope
], RateLimitService);
exports.RateLimitService = RateLimitService;
//# sourceMappingURL=ratelimit.service.js.map