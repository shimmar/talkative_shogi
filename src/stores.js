import { writable, readable } from 'svelte/store';

export const tokensInfo = readable({
	gyoku: { pic: '/gyoku.png', sound: 'ぎょく', promoted: null },
	hisha: { pic: '/hisha.png', sound: 'ひしゃ', promoted: 'ryu' },
	kaku: { pic: '/kaku.png', sound: 'かく', promoted: 'uma' },
	kin: { pic: '/kin.png', sound: 'きん', promoted: null },
	gin: { pic: '/gin.png', sound: 'ぎん', promoted: 'narigin' },
	kei: { pic: '/kei.png', sound: 'けい', promoted: 'narikei' },
	kyo: { pic: '/kyo.png', sound: 'きょう', promoted: 'narikyo' },
	fu: { pic: '/fu.png', sound: 'ふ', promoted: 'to' },
	ryu: { pic: '/ryu.png', sound: 'りゅう', promoted: null },
	uma: { pic: '/uma.png', sound: 'うま', promoted: null },
	narigin: { pic: '/narigin.png', sound: 'なりぎん', promoted: null },
	narikei: { pic: '/narikei.png', sound: 'なりけい', promoted: null },
	narikyo: { pic: '/narikyo.png', sound: 'なりきょう', promoted: null },
	to: { pic: '/to.png', sound: 'と', promoted: null }
});

export const mochigomaArray = readable(['hisha', 'kaku', 'kin', 'gin', 'kei', 'kyo', 'fu']);

//手番が先手ならtrue、後手ならfalse
export const turn = writable(true);
