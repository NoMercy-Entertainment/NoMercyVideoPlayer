export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

export type LogHandler = (
	level: LogLevel,
	category: string,
	message: string,
	context?: Record<string, unknown>,
) => void;

export interface LogConfig {
	level?: LogLevel;
	handler?: LogHandler;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3,
	verbose: 4,
};

const defaultHandler: LogHandler = (level, category, message, context) => {
	const prefix = category ? `[${category}]` : '';
	const args: unknown[] = [`${prefix} ${message}`];
	if (context && Object.keys(context).length > 0) {
		args.push(context);
	}

	switch (level) {
		case 'error':
			console.error(...args);
			break;
		case 'warn':
			console.warn(...args);
			break;
		default:
			console.log(...args);
			break;
	}
};

export class Logger {
	private threshold: number;
	private category: string;
	private handler: LogHandler;

	constructor(opts: { level?: LogLevel; category?: string; handler?: LogHandler } = {}) {
		this.threshold = LEVEL_PRIORITY[opts.level ?? 'error'];
		this.category = opts.category ?? '';
		this.handler = opts.handler ?? defaultHandler;
	}

	private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
		if (LEVEL_PRIORITY[level] <= this.threshold) {
			this.handler(level, this.category, message, context);
		}
	}

	error(message: string, context?: Record<string, unknown>): void {
		this.log('error', message, context);
	}

	warn(message: string, context?: Record<string, unknown>): void {
		this.log('warn', message, context);
	}

	info(message: string, context?: Record<string, unknown>): void {
		this.log('info', message, context);
	}

	debug(message: string, context?: Record<string, unknown>): void {
		this.log('debug', message, context);
	}

	verbose(message: string, context?: Record<string, unknown>): void {
		this.log('verbose', message, context);
	}
}
