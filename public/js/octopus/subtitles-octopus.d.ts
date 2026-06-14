// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

export interface SubtitlesOctopusOptions {
	video: HTMLVideoElement;
	subUrl: string;
	fonts?: string[];
	lossyRender?: boolean;
	accessToken?: string;
	targetFps?: number;
	debug?: boolean;
	blendRender?: boolean;
	lazyFileLoading?: boolean;
	renderAhead?: number;
	workerUrl?: string;
	legacyWorkerUrl?: string;
	fallbackFont?: string;
	onReady?: () => void;
	onError?: (event: unknown) => void;
}

declare class SubtitlesOctopus {
	worker: Worker;
	canvasParent: HTMLDivElement;

	constructor(options: SubtitlesOctopusOptions);
	dispose(): void;
}

export default SubtitlesOctopus;
