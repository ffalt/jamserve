import { InRequestScope } from 'typescript-ioc';
import express from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

function getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits: number): number {
	if (countConsecutiveOutOfLimits <= 1) {
		return 1;
	}
	return getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 1) + getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 2);
}

@InRequestScope
export class RateLimitService {
	loginLimiterOption = {
		points: 5, // 5 attempts
		duration: 15 * 60, // within 15 minutes
		keyPrefix: 'login'
	};

	loginLimiter = new RateLimiterMemory(this.loginLimiterOption);
	limiterConsecutiveOutOfLimits = new RateLimiterMemory({
		keyPrefix: 'login_consecutive_outoflimits',
		points: 99999, // doesn't matter much, this is just counter
		duration: 0 // never expire
	});

	async loginSlowDown(req: express.Request, res: express.Response): Promise<boolean> {
		const key = req.ip as string;
		try {
			const resConsume = await this.loginLimiter.consume(key);
			if (resConsume.remainingPoints <= 0) {
				const resPenalty = await this.limiterConsecutiveOutOfLimits.penalty(key);
				await this.loginLimiter.block(key, 60 * getFibonacciBlockDurationMinutes(resPenalty.consumedPoints));
			}
			res.set('X-RateLimit-Limit', `${this.loginLimiterOption.points}`);
			res.set('X-RateLimit-Remaining', `${resConsume.remainingPoints}`);
			return false;
		} catch (rlRejected: any) {
			if (rlRejected instanceof Error) {
				throw rlRejected;
			} else {
				const seconds = Math.round(rlRejected.msBeforeNext / 1000) || 1;
				res.set('Retry-After', `${seconds}`);
				res.status(429).send(`Too Many Requests, try again in ${seconds} seconds`);
				return true;
			}
		}
	}

	async loginSlowDownReset(req: express.Request): Promise<void> {
		const key = req.ip as string;
		await this.limiterConsecutiveOutOfLimits.delete(key);
		await this.loginLimiter.delete(key);
	}
}
