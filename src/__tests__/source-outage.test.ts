import { describe, expect, it } from 'vitest';

import {
	HTTP_STATUS_RETRY_LIMIT,
	isOriginDownStatus,
	SOURCE_OUTAGE_BACKOFF_MS,
	sourceOutageBudgetMs,
	sourceOutageRetryLimit,
} from '../adapters/video-backend/source-outage';

describe('source outage policy', () => {
	it('recognises the statuses cloudflared answers with while an origin restarts', () => {
		expect(isOriginDownStatus(530)).toBe(true);
		expect(isOriginDownStatus(521)).toBe(true);
		expect(isOriginDownStatus(502)).toBe(true);
		expect(isOriginDownStatus(504)).toBe(true);
		expect(isOriginDownStatus(404)).toBe(false);
		expect(isOriginDownStatus(200)).toBe(false);
	});

	it('gives an origin-down status the full ladder with no connection failure in front of it', () => {
		expect(sourceOutageRetryLimit(530, false)).toBe(SOURCE_OUTAGE_BACKOFF_MS.length);
	});

	it('fails a cold 404 fast, and rides the same 404 out after a refused connection', () => {
		expect(sourceOutageRetryLimit(404, false)).toBe(HTTP_STATUS_RETRY_LIMIT);
		expect(sourceOutageRetryLimit(404, true)).toBe(SOURCE_OUTAGE_BACKOFF_MS.length);
	});

	it('gives a failure that carried no response at all the full ladder', () => {
		expect(sourceOutageRetryLimit(0, false)).toBe(SOURCE_OUTAGE_BACKOFF_MS.length);
	});

	it('covers the warmup of a restarting host, which three tries over seven seconds did not', () => {
		expect(sourceOutageBudgetMs()).toBe(105_000);
	});
});
