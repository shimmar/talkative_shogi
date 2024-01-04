<script>
    import Board from './Board.svelte'
    import Komadai from './Komadai.svelte'
    import {controll,turn,pickedCoor,pickedKoma} from './stores.js'

    let getKoma1 = ''
    let getKoma2 = ''

    function handleRead(event) {
        const uttr = new SpeechSynthesisUtterance(event.detail.text);
        uttr.lang = 'ja-JP';
        speechSynthesis.speak(uttr);
	}
    function handlePick(event) {
        pickedCoor.set(event.detail.coor)
        pickedKoma.set(event.detail.kind)
        controll.set(1)
	}
    function handleMove(event) {
        if ($turn) {
            getKoma1=event.detail.text
        } else {
            getKoma2=event.detail.text
        }
        controll.set(2)
    }
    function handleFinished() {
        pickedCoor.set(-1)
        pickedKoma.set('')
        turn.set(!$turn)
        controll.set(0)
    }
</script>

<div class="main">
<Komadai sente={false} getKoma={getKoma2} on:read={handleRead} on:pick={handlePick} on:finished={handleFinished}></Komadai>
<Board on:read={handleRead} on:pick={handlePick} on:move={handleMove}></Board>
<Komadai sente={true} getKoma={getKoma1} on:read={handleRead} on:pick={handlePick} on:finished={handleFinished}></Komadai>
</div>
<style>
    .main{
        width:400px;
        margin-left: auto;
        margin-right: auto;
    }
</style>