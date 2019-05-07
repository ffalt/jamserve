export interface RuleResult {
	details?: Array<{ reason: string, expected?: string, actual?: string }>;
}
