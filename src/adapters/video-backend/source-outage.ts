/**
 * Telling "the bytes are not there right now" apart from "this media is broken".
 *
 * A media-server restart produces two failure shapes in one outage:
 * connection-refused while the host is down, then a bad HTTP status the moment
 * it is listening again but has not finished mapping its routes. Treating only
 * the first as recoverable ends the restart on a 404 no retry ladder ever sees,
 * and the session dies under an error overlay while the server is two seconds
 * from answering again.
 *
 * The previous ladder here was three tries over seven seconds, which is shorter
 * than a .NET host takes to warm EF Core and reload its plugins — so the common
 * case, a server the viewer themselves just restarted, always lost.
 *
 * Kept separate from the backend so the decision can be checked without a
 * browser: every answer below is a number-to-verdict lookup, and a lookup that
 * has drifted is invisible in a screenshot. Playback still fails, it just fails
 * for a reason nobody chose.
 */

/**
 * Backoff for re-loading after the server drops out mid-playback. Starts tight
 * so a momentary blip is invisible, then settles to a steady 15 s poll — long
 * enough to sit out a host restart without hammering a server that is still
 * booting. The ladder's length IS the give-up budget (~105 s); past that the
 * failure is real and the error surfaces.
 */
export const SOURCE_OUTAGE_BACKOFF_MS: readonly number[] = [
	1_000,
	2_000,
	4_000,
	8_000,
	15_000,
	15_000,
	15_000,
	15_000,
	15_000,
	15_000,
];

/**
 * Rungs an HTTP-status failure gets when nothing connection-level preceded it
 * (~30 s). A video whose URL is genuinely gone answers 404 identically every
 * time, and making the viewer watch a spinner for the full budget before being
 * told so is its own bug.
 */
export const HTTP_STATUS_RETRY_LIMIT = 5;

/** Total wall-clock the ladder covers before a failure is treated as real. */
export function sourceOutageBudgetMs(): number {
	return SOURCE_OUTAGE_BACKOFF_MS.reduce((total, rung) => total + rung, 0);
}

/**
 * True for a status that means "the server is not there", as opposed to "the
 * server is there and this file is not".
 *
 * Measured on a real outage: a NoMercy server behind cloudflared never refuses
 * a connection while it restarts — the edge answers 530, and 52x for its other
 * failure modes. So the shape a restart actually takes is a bad HTTP status
 * with no connection error anywhere in front of it, which is exactly the case a
 * connection-failure-gated budget would cut short.
 */
export function isOriginDownStatus(httpStatus: number): boolean {
	return (httpStatus >= 520 && httpStatus <= 530)
		|| httpStatus === 502
		|| httpStatus === 503
		|| httpStatus === 504;
}

/**
 * How many rungs this failure is allowed.
 *
 * @param httpStatus - The status the load gave up on, or 0 when the failure
 *   carried no response at all, which is what a refused connection looks like
 *   from a browser.
 * @param sawConnectionFailure - Whether anything in this outage already failed
 *   below the HTTP layer. That is what tells a restarting server's 404 apart
 *   from a video that is genuinely gone.
 */
export function sourceOutageRetryLimit(
	httpStatus: number,
	sawConnectionFailure: boolean,
): number {
	if (sawConnectionFailure)
		return SOURCE_OUTAGE_BACKOFF_MS.length;
	if (isOriginDownStatus(httpStatus))
		return SOURCE_OUTAGE_BACKOFF_MS.length;
	if (httpStatus > 0)
		return HTTP_STATUS_RETRY_LIMIT;

	return SOURCE_OUTAGE_BACKOFF_MS.length;
}
