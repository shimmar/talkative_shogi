<script>
    import Board from './Board.svelte'
    import Komadai from './Komadai.svelte'
    import {turn} from './stores.js'

    function handleRead(event) {
        const uttr = new SpeechSynthesisUtterance(event.detail.text);
        uttr.lang = 'ja-JP';
        speechSynthesis.speak(uttr);
	}
    function handlePick(event) {
        console.log($turn + "picked" + event.detail.text)
	}
</script>

<Komadai sente={false} on:read={handleRead} on:pick={handlePick}></Komadai>
<Board></Board>
<Komadai sente={true} on:read={handleRead} on:pick={handlePick}></Komadai>