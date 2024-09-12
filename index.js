import nmplayer from './src/index.ts';
import { OctopusPlugin } from './src/plugins/octopusPlugin';
import { DesktopUIPlugin } from './src/plugins/desktopUIPlugin';
import { MobileUIPlugin } from './src/plugins/mobileUIPlugin';
import { TVUIPlugin } from './src/plugins/tvUIPlugin';
import { KeyHandlerPlugin } from './src/plugins/keyHandlerPlugin';

// const gain = document.querySelector('#gain');
// const gainSlider = document.querySelector('#gainSlider');
// const enableGain = document.querySelector('#enableGain');

const audioTracks = document.querySelector('#audioTracks');
const currentAudio = document.querySelector('#currentAudio');
const subtitleTracks = document.querySelector('#subtitleTracks');
const currentSubtitle = document.querySelector('#currentSubtitle');
const qualities = document.querySelector('#qualities');
const currentQuality = document.querySelector('#currentQuality');

// gainSlider.addEventListener('change', (e) => {
// 	if (!player.gainNode) {
// 		gainSlider.value = 1;
// 		return;
// 	}
//	
// 	player.setGain(e.target.value);
// });

// enableGain.addEventListener('click', (e) => {
// 	player.addGainNode();
// 	enableGain.style.display = 'none';
// 	gainSlider.style.display = '';
// });


/**
 * @type {import("./src/index.d").SetupConfig}
 */
const config = {
	muted: false,
	controls: false,
	preload: 'auto',
	debug: false,
	playlist: [
		{
			title: 'Cosmos Laundromat',
			description: 'On a desolate island, a suicidal sheep named Franck meets his fate…in the form of a quirky salesman named Victor, who offers him the gift of a lifetime. The gift is many lifetimes, actually, in many different worlds – each lasting just a few minutes. In the sequel to the pilot, Franck will find a new reason to live…in the form of a bewitching female adventurer named Tara, who awakens his long-lost lust for life. But can Franck keep up with her?',
			image: 'https://image.tmdb.org/t/p/w780/f2wABsgj2lIR2dkDEfBZX8p4Iyk.jpg',
			file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/Cosmos.Laundromat.(2015).NoMercy.m3u8',
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
					label: 'Portugese Brazilian (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.pob.full.vtt',
					language: 'nor',
					kind: 'subtitles',
				},
				{
					label: 'Spanish (Full)',
					file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.spa.full.vtt',
					language: 'swe',
					kind: 'subtitles',
				},
				{
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/thumbs_256x144.vtt",
					kind: "thumbnails"
				},
				{
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/chapters.vtt",
					kind: "chapters"
				},
				{
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Cosmos.Laundromat.(2015)/thumbs_256x144.webp",
					kind: "sprite"
				},
			],
		},
		{
			title: 'Sintel',
			description: 'Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender. With initial funding provided by 1000s of donations via the internet community, it has again proven to be a viable development model for both open 3D technology as for independent animation film.\nThis 15 minute film has been realized in the studio of the Amsterdam Blender Institute, by an international team of artists and developers. In addition to that, several crucial technical and creative targets have been realized online, by developers and artists and teams all over the world.\nwww.sintel.org',
			'image': 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
			'file': 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
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
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/thumbs_256x109.vtt",
					kind: "thumbnails"
				},
				{
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/chapters.vtt",
					kind: "chapters"
				},
				{
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Sintel.(2010)/thumbs_256x109.webp",
					kind: "sprite"
				},
			],
		},
		{
			title: 'Tears of Steel',
			description: 'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - https://www.tearsofsteel.org',
			image: 'https://image.tmdb.org/t/p/w780/fOy6SL5Zs2PFcNXwqEPIDPrLB1q.jpg',
			file: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/Tears.of.Steel.(2012).NoMercy.m3u8',
			tracks: [
				{
					label: "Brazilian (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.bra.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Chinese (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.chi.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Croatian (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.cro.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Chech (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.cze.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Danish (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.dan.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Dutch (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.dut.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "English (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.eng.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "French (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.fre.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "German (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.ger.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Greek (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.gre.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Hebrew (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.heb.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Hungarian (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.hun.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Indian (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.ind.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Italian (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.ita.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Japanese (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.jpn.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Norwegian (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.nor.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Persian (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.per.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Portugese (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.por.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Russian (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.rus.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					label: "Spanish (Full)",
					type: "sdh",
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/subtitles/Tears.of.Steel.(2012).NoMercy.spa.full.vtt",
					language: "eng",
					kind: "subtitles"
				},
				{
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/previews.vtt",
					kind: "thumbnails"
				},
				{
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/chapters.vtt",
					kind: "chapters"
				},
				{
					file: "https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films/Tears.of.Steel.(2012)/previews.webp",
					kind: "sprite"
				},
			],
		},
		{
			title: 'Rail Wars',
			description: 'Takayama enters the training program of JNR with the ambition of becoming one of the venerable train company\'s engineers. As a trainee he is teamed up with fight-ready Sakurai and stolid Iwaizumi and fellow Haruka Kōmi who has encyclopedic knowledge of trains. Together they learn how security officers for the train line work and get involved in more than one tricky situation.',
			image: 'https://image.tmdb.org/t/p/original/vH8NqN2LMcmtBv037iHGwcPOgCZ.jpg',
			file: 'https://backstore.fra1.digitaloceanspaces.com/demo/railwars/railwars.mp4',
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
			description: 'The sudden retirement of the famous idol Yuka Kusakabe from the entertainment business shocks the world and devastates her biggest fan, teenager Kosaku Hata. His classmates at the Tamo Agriculture School manages to get him out of his depression and bring him out of his room to attend his classes. But to everyone\'s surprise, Yuka Kusakabe - her stage name - comes into their class under the name Ringo Kinoshita as a transfer student. Kosaku realizes he has a once-in-a-lifetime opportunity to get to personally know his dream girl and, together with his group of friends, try to find out why she came to the agricultural school and become more than just classmates.',
			image: 'https://image.tmdb.org/t/p/original/myHS6X2yonpoBQOptVuQ85PudtC.jpg',
			file: 'https://backstore.fra1.digitaloceanspaces.com/demo/nourin/nourin.mp4',
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
	],
	fullscreen: {
		iOS: true,
		alwaysInLandscapeMode: true,
		enable: true,
		enterOnRotate: true,
		exitOnRotate: true,
	},

	// NoMercy test account
	// accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJkNWE1YTAwNS05ZWE2LTRlODMtYmZmNy05ZTQ0MjY5OTg4OWMiLCJqdGkiOiJiNDAyZWU0YThjNGYxYzJjN2RhNmE0ODZjNjY2NDI4YWYyMzMwNGI2MzIyNzRmZjZjNThkODI2YTdjYTEzYTFhYmM2NTA2YjIyOWVmNWE3YiIsImlhdCI6MTY5MzI0NTIwNi42Mjk3NTUsIm5iZiI6MTY5MzI0NTIwNi42Mjk3NTYsImV4cCI6MTcyNDc4MTIwNi42MjM2NjcsInN1YiI6ImQ5OWE1NzQxLTM2ZTgtNGU1ZC1iYzUzLTg1MzAyNmIzZjRhYSIsInNjb3BlcyI6WyJvcGVuaWQiLCJwcm9maWxlIiwiZW1haWwiXSwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBub21lcmN5LnR2In0.GV7HlmRAVDL3Bb1MdWltS1AX8dR1LHRMF_vtvM01abLu2983djSKSUvtB26KV5MCpOSuOX-ZwlBlqbMJ5JUX55fSonUE0oiz0ujn8QIk0-G0ptB1-hqn6qIRtxncwZaT0TGNpF7TFejjMC_VcqwjtzmRA58JC940u7QL7k5304cbHJXv-_Op1FpAR3dRA0g3BVR8uJ5ckp1hO-KAj83NOetnviglQf6130WQKtx2AWC1qT55NW3Xx1YFAZZUptjgRZ5mhvDd0_OmTNnFvsQZYaHr5H2WFAzKfW7GEvlu7xFIiMxfhpfowyvV3u4VqoDU-wIfkod-U0lL9JlwnsufFAvE_dfXjMhDXZG80oFPifYLanj7DsL4lIfbaVJO92W1K4bYW0t8Jfi8U3ZdqXtvPSpjPmx5dyz9Z2Na16GtH0_sZu5oMPgbGRMk0pZLi0uGWb_Wxyg3MFMEE4f0zA3gRSc1yt3gCI-AIaiCeMKAbC_uPauV3QcNzbCV2JVxOzW-tKlexALBPYe53DKkODPVcQHhv_d1sqXZxqwS8OfkZzqNCg2MpN2DodgSAVM8b1xZMG_6Ym-hEtDYw0ZCghda7v0pZSAo67jFDv5kEk9MF4j7OGfvk3sFT-mi7gFogKLByrMfQMfs4-qnHrsoKOVZRU6S1JHkRJFSxkwcamv_AYI',
};

config.subtitleRenderer = 'octopus';
config.sabreVersion = '0.5.1-pre.8bd763';

const player = nmplayer('player')
	.setup(config);

// const sabrePlugin = new SabrePlugin();
// player.registerPlugin('sabre', sabrePlugin);
// player.usePlugin('sabre');

const desktopUIPlugin = new DesktopUIPlugin();
player.registerPlugin('desktopUI', desktopUIPlugin);
player.usePlugin('desktopUI');

const mobileUIPlugin = new MobileUIPlugin();
player.registerPlugin('mobileUI', mobileUIPlugin);
player.usePlugin('mobileUI');

const tvUIPlugin = new TVUIPlugin();
player.registerPlugin('tvUI', tvUIPlugin);
player.usePlugin('tvUI');

const octopusPlugin = new OctopusPlugin();
player.registerPlugin('octopus', octopusPlugin);
player.usePlugin('octopus');

const keyHandlerPlugin = new KeyHandlerPlugin();
player.registerPlugin('keyHandler', keyHandlerPlugin);
player.usePlugin('keyHandler');

player.on('ready', (data) => {
	console.log('ready', data);
});
player.on('setupError', (data) => {
	console.log('setupError', data);
});

// Playlist
player.on('playlist', (data) => {
	console.log('playlist', data);
});
player.on('playlistItem', (data) => {
	console.log('playlistItem', data);
});
player.on('playlistComplete', (data) => {
	console.log('playlistComplete', data);
});

// Buffer
player.on('bufferChange', (data) => {
	console.log('bufferChange', data);
});

// Playback
player.on('firstFrame', () => {
	console.log('firstFrame');
});
player.on('play', (data) => {
	console.log('play', data);
});
player.on('pause', (data) => {
	console.log('pause', data);
});
player.on('buffer', (data) => {
	console.log('buffer', data);
});
player.on('idle', (data) => {
	console.log('idle', data);
});
player.on('complete', (data) => {
	console.log('complete', data);
});
player.on('error', (data) => {
	console.log('error', data);
});
// Seek
player.on('seek', (data) => {
	console.log('seek', data);
});
player.on('seeked', (data) => {
	console.log('seeked', data);
});
player.on('time', (data) => {
	// console.log('time', data);
});

// Volume
player.on('mute', (data) => {
	console.log('mute', data);
});
player.on('volume', (data) => {
	console.log('volume', data);
});

player.on('gain', (data) => {
	console.log('gain', data);
	gain.innerHTML = data.value;
	gainSlider.value = data.value;
});

// Resize
player.on('fullscreen', (data) => {
	console.log('fullscreen', data);
});
player.on('resize', (data) => {
	console.log('resize', data);
});

// Quality
player.on('levels', (data) => {
	console.log('levels', data);
	qualities.innerHTML = '';

	const levelsList = player
		.createElement('ul', 'levelTrackList', true)
		.addClasses(['nm-overflow-auto'])
		.appendTo(qualities);

	Object.values(data).forEach((track) => {
		const levelTrack = player
			.createElement('li', `levelTrack-${track.name}`)
			.addClasses([
				'nm-p-2',
				'nm-cursor-pointer',
				'nm-border-b',
			])
			.appendTo(levelsList);

		levelTrack.innerHTML = track.name;

		player.on('levelsChanging', (data) => {
			levelTrack.innerHTML = track.name + (data.id === track.id ? ' &#x2714;' : '');
		});

		levelTrack.addEventListener('click', () => {
			player.setCurrentQuality(track.id);
		});
	});
});

player.on('levelsChanged', (data) => {
	console.log('levelsChanged', data);
	currentQuality.innerHTML = data.name;
});

// Audio Tracks
player.on('audioTracks', (data) => {
	console.log('audioTracks', data);
	audioTracks.innerHTML = '';

	const audioList = player
		.createElement('ul', 'audioTrackList', true)
		.addClasses(['nm-overflow-auto'])
		.appendTo(audioTracks);

	Object.values(data).forEach((track) => {
		const audioTrack = player
			.createElement('li', `audioTrack-${track.name}`)
			.addClasses([
				'nm-p-2',
				'nm-cursor-pointer',
				'nm-border-b',
			])
			.appendTo(audioList);

		audioTrack.innerHTML = track.name + (data.id === track.id || track.id === 0 ? ' &#x2714;' : '');
		
		player.on('audioTrackChanged', (data) => {
			audioTrack.innerHTML = track.name + (data.id === track.id ? ' &#x2714;' : '');
		});

		audioTrack.addEventListener('click', () => {
			player.setCurrentAudioTrack(track.id);
		});
	});
});

player.on('audioTrackChanged', (data) => {
	console.log('audioTrackChanged', data);
	currentAudio.innerHTML = data.name;
});

// Captions
player.on('captionsList', (data) => {
	console.log('captionsList', data);
	subtitleTracks.innerHTML = '';

	const captionList = player
		.createElement('ul', 'captionTrackList', true)
		.addClasses(['nm-overflow-auto'])
		.appendTo(subtitleTracks);

	Object.values(data).forEach((track, index) => {
		const captionTrack = player
			.createElement('li', `captionTrack-${track.name}`)
			.addClasses([
				'nm-p-2',
				'nm-cursor-pointer',
				'nm-border-b',
			])
			.appendTo(captionList);

		captionTrack.innerHTML = track.label;
		
		player.on('captionsChange', (data) => {
			captionTrack.innerHTML = track.label + (data.id === track.id ? ' &#x2714;' : '');
		});

		captionTrack.addEventListener('click', () => {
			player.setCurrentCaption(index);
		});
	});
});
player.on('captionsChange', (data) => {
	console.log('captionsChange', data.label);
	currentSubtitle.innerHTML = player.getCurrentCaptionsName();
});

// Controls
player.on('controls', (data) => {
	console.log('controls', data);
});
player.on('displayClick', (data) => {
	console.log('displayClick', data);
});

// Advertising
player.on('adClick', (data) => {
	console.log('adClick', data);
});
player.on('adCompanions', (data) => {
	console.log('adCompanions', data);
});
player.on('adComplete', (data) => {
	console.log('adComplete', data);
});
player.on('adError', (data) => {
	console.log('adError', data);
});
player.on('adImpression', (data) => {
	console.log('adImpression', data);
});
player.on('adTime', (data) => {
	console.log('adTime', data);
});
player.on('adSkipped', (data) => {
	console.log('adSkipped', data);
});
player.on('beforePlay', (data) => {
	console.log('beforePlay', data);
});
player.on('beforeComplete', (data) => {
	console.log('beforeComplete', data);
});

// Metadata
player.on('meta', (data) => {
	console.log('meta', data);
});

player.on('lastTimeTrigger', (data) => {
	console.log('lastTimeTrigger', data);
});

player.on('theaterMode', (data) => {
	// handle resize container
	console.log('theaterMode', data);
});
player.on('pip', (data) => {
	console.log('pip', data);
});
