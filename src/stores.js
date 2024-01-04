import { writable, readable } from 'svelte/store';

export const tokensInfo = readable({
	gyoku: { pic: '/gyoku.png', sound: 'ぎょく', demoted: null, promoted: null },
	hisha: { pic: '/hisha.png', sound: 'ひしゃ', demoted: null, promoted: 'ryu' },
	kaku: { pic: '/kaku.png', sound: 'かく', demoted: null, promoted: 'uma' },
	kin: { pic: '/kin.png', sound: 'きん', demoted: null, promoted: null },
	gin: { pic: '/gin.png', sound: 'ぎん', demoted: null, promoted: 'narigin' },
	kei: { pic: '/kei.png', sound: 'けい', demoted: null, promoted: 'narikei' },
	kyo: { pic: '/kyo.png', sound: 'きょう', demoted: null, promoted: 'narikyo' },
	fu: { pic: '/fu.png', sound: 'ふ', demoted: null, promoted: 'to' },
	ryu: { pic: '/ryu.png', sound: 'りゅう', demoted: 'hisha', promoted: null },
	uma: { pic: '/uma.png', sound: 'うま', demoted: 'kaku', promoted: null },
	narigin: { pic: '/narigin.png', sound: 'なりぎん', demoted: 'gin', promoted: null },
	narikei: { pic: '/narikei.png', sound: 'なりけい', demoted: 'kei', promoted: null },
	narikyo: { pic: '/narikyo.png', sound: 'なりきょう', demoted: 'kyo', promoted: null },
	to: { pic: '/to.png', sound: 'と', demoted: 'fu', promoted: null }
});

export const mochigomaArray = readable(['hisha', 'kaku', 'kin', 'gin', 'kei', 'kyo', 'fu']);

//0:駒選択待ち 1:移動先指定待ち 2:Komadaiコンポーネントに変更反映待ち
export const control = writable(0);
//手番が先手ならtrue、後手ならfalse
export const turn = writable(true);
export const pickedCoor = writable(-1);
export const pickedKoma = writable('');
