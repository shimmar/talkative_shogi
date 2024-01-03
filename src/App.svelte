<script>
    import Board from './Board.svelte'
    import Komadai from './Komadai.svelte'
    import {turn,moveCompleted,pickedCoor,pickedKoma} from './stores.js'

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
        console.log($turn + "picked" + event.detail.coor + event.detail.kind)
	}
    function handleMove(event) {
        if ($turn) {
            getKoma1=event.detail.text
        } else {
            getKoma2=event.detail.text
        }
        moveCompleted.set(true)
    }
    function handleFinished() {
        moveCompleted.set(false)
        pickedCoor.set(-1)
        console.log('pickedCoor reseted')
        pickedKoma.set('')
        turn.set(!$turn)
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