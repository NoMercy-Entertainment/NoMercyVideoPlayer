import { describe, expect, it } from 'vitest';

import {
	HTTP_STATUS_RETRY_LIMIT,
	isMediaAbsentStatus,
	isOriginDownStatus,
	MEDIA_ABSENT,
	NO_RETRIES,
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

	it('does not retry a cold 404 at all, and rides the same 404 out after a refused connection', () => {
		// Was five rungs — thirty seconds of spinner on an episode that was never
		// encoded. The server answered definitively the first time.
		expect(sourceOutageRetryLimit(404, false)).toBe(NO_RETRIES);
		expect(sourceOutageRetryLimit(404, true)).toBe(SOURCE_OUTAGE_BACKOFF_MS.length);
	});

	it('gives a failure that carried no response at all the full ladder', () => {
		expect(sourceOutageRetryLimit(0, false)).toBe(SOURCE_OUTAGE_BACKOFF_MS.length);
	});

	it('covers the warmup of a restarting host, which three tries over seven seconds did not', () => {
		expect(sourceOutageBudgetMs()).toBe(105_000);
	});

	it('reads 404 and 410 as the server saying the media is absent', () => {
		expect(isMediaAbsentStatus(404)).toBe(true);
		expect(isMediaAbsentStatus(410)).toBe(true);
	});

	it('does not treat any other status as a definite absence', () => {
		// 403 and 401 are about who is asking, not whether the file exists, and
		// 500 is the server failing rather than answering. Folding any of them in
		// would end a session that a retry or a re-auth fixes.
		for (const status of [0, 401, 403, 408, 429, 500, 502, 503, 504, 520, 530])
			expect(isMediaAbsentStatus(status)).toBe(false);
	});

	it('keeps the whole ladder for an outage while an absent file gets none', () => {
		// The two verdicts must not collapse: a restarting server and a missing
		// episode both arrive as a bad HTTP status, and one is worth waiting for.
		expect(sourceOutageRetryLimit(404, false)).toBe(NO_RETRIES);
		expect(sourceOutageRetryLimit(503, false)).toBe(SOURCE_OUTAGE_BACKOFF_MS.length);
	});

	it('still gives a 403 its rungs rather than reading it as a missing file', () => {
		// Our own abuse guard answers a bare 403, and that is worth retrying.
		expect(sourceOutageRetryLimit(403, false)).toBe(HTTP_STATUS_RETRY_LIMIT);
	});

	it('names the absent-media code the same as the Kotlin trio', () => {
		// A client written against one trio must not be wrong on the other.
		expect(MEDIA_ABSENT).toBe('core:stream/media-absent');
	});
});
