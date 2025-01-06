import nmplayer from './src/index';
import { OctopusPlugin } from './src/plugins/octopusPlugin';
import { KeyHandlerPlugin } from './src/plugins/keyHandlerPlugin';
import type { SetupConfig } from './src/index.d';

const config: SetupConfig = {
	muted: false,
	controls: false,
	preload: 'auto',
	debug: false,
	playlist: [
		{
			title: 'Sintel',
			id: 'sintel',
			description: 'Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender. With initial funding provided by 1000s of donations via the internet community, it has again proven to be a viable development model for both open 3D technology as for independent animation film.\nThis 15 minute film has been realized in the studio of the Amsterdam Blender Institute, by an international team of artists and developers. In addition to that, several crucial technical and creative targets have been realized online, by developers and artists and teams all over the world.\nwww.sintel.org',
			image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
			logo: 'https://image.tmdb.org/t/p/original/p3NwyW8Jf5AGmKk5B0K69MhiMWv.png',
			file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
			duration: '14:48',
			// season: 1,
			episode: 1,
			year: 2010,
			rating: {
				rating: 6,
				image: 'NL/NL_6.svg',
			},
			tracks: [
				{
					label: 'Dutch (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.dut.full.vtt',
					language: 'dut',
					kind: 'subtitles',
				},
				{
					label: 'English (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.eng.full.vtt',
					language: 'eng',
					kind: 'subtitles',
				},
				{
					label: 'French (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.fre.full.vtt',
					language: 'fre',
					kind: 'subtitles',
				},
				{
					label: 'German (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.ger.full.vtt',
					language: 'ger',
					kind: 'subtitles',
				},
				{
					label: 'Italian (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.ita.full.vtt',
					language: 'ita',
					kind: 'subtitles',
				},
				{
					label: 'Russian (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.rus.full.vtt',
					language: 'rus',
					kind: 'subtitles',
				},
				{
					label: 'German (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.ger.full.vtt',
					language: 'ger',
					kind: 'subtitles',
				},
				{
					label: 'Portuguese (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.por.full.vtt',
					language: 'por',
					kind: 'subtitles',
				},
				{
					label: 'Spanish (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.spa.full.vtt',
					language: 'spa',
					kind: 'subtitles',
				},
				{
					label: 'Polish (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.pol.full.vtt',
					language: 'pol',
					kind: 'subtitles',
				},
				{
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/thumbs_256x109.vtt',
					kind: 'thumbnails',
				},
				{
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/chapters.vtt',
					kind: 'chapters',
				},
				{
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/thumbs_256x109.webp',
					kind: 'sprite',
				},
			],
		},
		{
			title: 'Cosmos Laundromat',
			id: 'cosmos-laundromat',
			description: 'On a desolate island, a suicidal sheep named Franck meets his fate…in the form of a quirky salesman named Victor, who offers him the gift of a lifetime. The gift is many lifetimes, actually, in many different worlds – each lasting just a few minutes. In the sequel to the pilot, Franck will find a new reason to live…in the form of a bewitching female adventurer named Tara, who awakens his long-lost lust for life. But can Franck keep up with her?',
			image: 'https://image.tmdb.org/t/p/w780/f2wABsgj2lIR2dkDEfBZX8p4Iyk.jpg',
			logo: 'https://image.tmdb.org/t/p/original/kJL8smUGlQ29mPLcook393vYt4X.png',
			file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/Cosmos.Laundromat.(2015).NoMercy.m3u8',
			duration: '12:04',
			// season: 1,
			episode: 2,
			year: 2015,
			rating: {
				rating: 12,
				image: 'NL/NL_12.svg',
			},
			tracks: [
				{
					label: 'Dutch (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.dut.full.vtt',
					language: 'dut',
					kind: 'subtitles',
				},
				{
					label: 'English (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.eng.full.vtt',
					language: 'eng',
					kind: 'subtitles',
				},
				{
					label: 'French (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.fre.full.vtt',
					language: 'fre',
					kind: 'subtitles',
				},
				{
					label: 'Italian (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.ita.full.vtt',
					language: 'ita',
					kind: 'subtitles',
				},
				{
					label: 'Brazilian Portuguese (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.pob.full.vtt',
					language: 'pob',
					kind: 'subtitles',
				},
				{
					label: 'Spanish (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.spa.full.vtt',
					language: 'spa',
					kind: 'subtitles',
				},
				{
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/thumbs_256x144.vtt',
					kind: 'thumbnails',
				},
				{
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/chapters.vtt',
					kind: 'chapters',
				},
				{
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/thumbs_256x144.webp',
					kind: 'sprite',
				},
			],
		},
		{
			title: 'Tears of Steel',
			id: 'tears-of-steel',
			description: 'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - https://www.tearsofsteel.org',
			image: 'https://image.tmdb.org/t/p/w780/fOy6SL5Zs2PFcNXwqEPIDPrLB1q.jpg',
			logo: 'https://image.tmdb.org/t/p/original/z189jjuLnQ77QyipJ0i33mGEjiS.png',
			file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/Tears.of.Steel.(2012).NoMercy.m3u8',
			duration: '12:13',
			// season: 1,
			episode: 3,
			year: 2012,
			rating: {
				rating: 6,
				image: 'NL/NL_6.svg',
			},
			tracks: [
				{
					label: 'Brazilian (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.bra.full.vtt',
					language: 'bra',
					kind: 'subtitles',
				},
				{
					label: 'Chinese (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.chi.full.vtt',
					language: 'chi',
					kind: 'subtitles',
				},
				{
					label: 'Croatian (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.cro.full.vtt',
					language: 'cro',
					kind: 'subtitles',
				},
				{
					label: 'Chech (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.cze.full.vtt',
					language: 'cze',
					kind: 'subtitles',
				},
				{
					label: 'Danish (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.dan.full.vtt',
					language: 'dan',
					kind: 'subtitles',
				},
				{
					label: 'Dutch (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.dut.full.vtt',
					language: 'dut',
					kind: 'subtitles',
				},
				{
					label: 'English (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.eng.full.vtt',
					language: 'eng',
					kind: 'subtitles',
				},
				{
					label: 'French (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.fre.full.vtt',
					language: 'fre',
					kind: 'subtitles',
				},
				{
					label: 'German (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.ger.full.vtt',
					language: 'ger',
					kind: 'subtitles',
				},
				{
					label: 'Greek (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.gre.full.vtt',
					language: 'gre',
					kind: 'subtitles',
				},
				{
					label: 'Hebrew (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.heb.full.vtt',
					language: 'heb',
					kind: 'subtitles',
				},
				{
					label: 'Hungarian (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.hun.full.vtt',
					language: 'hun',
					kind: 'subtitles',
				},
				{
					label: 'Indian (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.ind.full.vtt',
					language: 'ind',
					kind: 'subtitles',
				},
				{
					label: 'Italian (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.ita.full.vtt',
					language: 'ita',
					kind: 'subtitles',
				},
				{
					label: 'Japanese (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.jpn.full.vtt',
					language: 'jpn',
					kind: 'subtitles',
				},
				{
					label: 'Norwegian (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.nor.full.vtt',
					language: 'nor',
					kind: 'subtitles',
				},
				{
					label: 'Persian (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.per.full.vtt',
					language: 'per',
					kind: 'subtitles',
				},
				{
					label: 'Portugese (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.por.full.vtt',
					language: 'por',
					kind: 'subtitles',
				},
				{
					label: 'Russian (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.rus.full.vtt',
					language: 'rus',
					kind: 'subtitles',
				},
				{
					label: 'Spanish (Full)',
					type: 'sdh',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.spa.full.vtt',
					language: 'spa',
					kind: 'subtitles',
				},
				{
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/previews.vtt',
					kind: 'thumbnails',
				},
				{
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/chapters.vtt',
					kind: 'chapters',
				},
				{
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/sprite.webp',
					kind: 'sprite',
				},
			],
		},
		{
			title: 'Rail Wars',
			id: 'rail-wars',
			description: 'Takayama enters the training program of JNR with the ambition of becoming one of the venerable train company\'s engineers. As a trainee he is teamed up with fight-ready Sakurai and stolid Iwaizumi and fellow Haruka Kōmi who has encyclopedic knowledge of trains. Together they learn how security officers for the train line work and get involved in more than one tricky situation.',
			image: 'https://image.tmdb.org/t/p/original/vH8NqN2LMcmtBv037iHGwcPOgCZ.jpg',
			file: 'https://backstore.fra1.digitaloceanspaces.com/demo/railwars/railwars.mp4',
			duration: '1:30',
			// season: 1,
			episode: 4,
			rating: {
				rating: 6,
				image: 'NL/NL_6.svg',
			},
			tracks: [
				{
					label: 'English (Full)',
					file: 'https://backstore.fra1.digitaloceanspaces.com/demo/railwars/railwars.ass',
					language: 'eng',
					kind: 'subtitles',
				},
				{
					file: 'https://media.nomercy.tv/Films/Films/Rail.Wars.(2014)/fonts.json',
					kind: 'fonts',
				},
			],
		},
		{
			title: 'No-Rin',
			rating: {
				rating: 9,
				image: 'NL/NL_9.svg',
			},
			id: 'no-rin',
			description: 'The sudden retirement of the famous idol Yuka Kusakabe from the entertainment business shocks the world and devastates her biggest fan, teenager Kosaku Hata. His classmates at the Tamo Agriculture School manages to get him out of his depression and bring him out of his room to attend his classes. But to everyone\'s surprise, Yuka Kusakabe - her stage name - comes into their class under the name Ringo Kinoshita as a transfer student. Kosaku realizes he has a once-in-a-lifetime opportunity to get to personally know his dream girl and, together with his group of friends, try to find out why she came to the agricultural school and become more than just classmates.',
			image: 'https://image.tmdb.org/t/p/original/myHS6X2yonpoBQOptVuQ85PudtC.jpg',
			file: 'https://backstore.fra1.digitaloceanspaces.com/demo/nourin/nourin.mp4',
			duration: '23:39',
			// season: 1,
			episode: 5,
			tracks: [
				{
					label: 'English (Full)',
					file: 'https://backstore.fra1.digitaloceanspaces.com/demo/nourin/nourin.ass',
					language: 'eng',
					kind: 'subtitles',
				},
				{
					file: 'https://media.nomercy.tv/Films/Films/No-Rin.(2014)/fonts.json',
					kind: 'fonts',
				},
			],
		},
	],
	controlsTimeout: 3000,
	doubleClickDelay: 500,
	playbackRates: [
		0.25,
		0.5,
		0.75,
		1,
		1.25,
		1.5,
		1.75,
		2,
	]
};

/*
	@type {player} 
*/
const player = nmplayer('player')
	.setup(config);

const keyHandlerPlugin = new KeyHandlerPlugin();
player.registerPlugin('keyHandler', keyHandlerPlugin);
player.usePlugin('keyHandler');
//
// const desktopUIPlugin = new DesktopUIPlugin();
// player.registerPlugin('desktopUI', desktopUIPlugin);
// player.usePlugin('desktopUI');

const octopusPlugin = new OctopusPlugin();
player.registerPlugin('octopus', octopusPlugin);
player.usePlugin('octopus');

// const sabrePlugin = new SabrePlugin();
// player.registerPlugin('sabre', sabrePlugin);
// player.usePlugin('sabre');

player.on('ready', () => {
	console.log('ready');
});

player.on('setupError', (data) => {
	console.log('setupError', data);
});

// Playlist

player.on('playlist', (data) => {
	console.log('playlist', data);
});

player.on('item', (data) => {
	console.log('item', data);
});

player.on('playlistComplete', () => {
	console.log('playlistComplete');
});

// Buffer

player.on('bufferChange', () => {
	console.log('bufferChange');
});

// Playback
player.on('firstFramce', () => {
	console.log('firstFrame');
});

player.on('play', () => {
	console.log('play');
});

player.on('pause', () => {
	console.log('pause');
});

player.on('buffer', () => {
	console.log('buffer');
});

player.on('idle', () => {
	console.log('idle');
});

player.on('complete', () => {
	console.log('complete');
});

player.on('error', () => {
	console.log('error');
});
// Seek
player.on('seek', (data) => {
	console.log('seek', data);
});
player.on('seeked', (data) => {
	console.log('seeked', data);
});

player.on('time', (data) => {
	console.log('time', data);
});

// Volume
player.on('mute', (data) => {
	console.log('mute', data);
});
player.on('volume', (data) => {
	console.log('volume', data);
});

// Resize
player.on('fullscreen', (data) => {
	console.log('fullscreen', data);
});

player.on('resize', () => {
	console.log('resize');
});

// Quality
player.on('levels', (data) => {
	console.log('levels', data);
});

player.on('levelsChanged', (data) => {
	console.log('levelsChanged', data);
});

// Audio Tracks
player.on('audioTracks', (data) => {
	console.log('audioTracks', data);
});

player.on('audioTrackChanged', (data) => {
	console.log('audioTrackChanged', data);
});

// Captions
player.on('captionsList', (data) => {
	console.log('captionsList', data);
});

player.on('captionsChanged', (data) => {
	console.log('captionsChanged', data.id);
});

// Controls
player.on('controls', (showing) => {
	console.log('controls', showing);
});


player.on('beforePlay', () => {
	console.log('beforePlay');
});

player.on('beforeComplete', () => {
	console.log('beforeComplete');
});

// Metadata

player.on('meta', () => {
	console.log('meta');
});


player.on('lastTimeTrigger', (data) => {
	console.log('lastTimeTrigger');
});