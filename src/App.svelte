<script>
    import Board from './Board.svelte'
    import Komadai from './Komadai.svelte'
    import {control,turn,pickedCoor,pickedKoma} from './stores.js'

    let getKoma1 = ''
    let getKoma2 = ''
    /**
	 * @type {HTMLAudioElement}
	 */
    let selectSound
    /**
	 * @type {HTMLAudioElement}
	 */
    let moveSound
    if (typeof Audio != 'undefined') {
        selectSound = new Audio('/select.mp3')
        selectSound.volume = 0.5
        selectSound.loop = false
        moveSound = new Audio('/move.mp3')
        moveSound.volume = 0.5
        moveSound.loop = false
    }
    function handleRead(event) {
        const uttr = new SpeechSynthesisUtterance(event.detail.text);
        uttr.lang = 'ja-JP';
        speechSynthesis.speak(uttr);
	}
    function handlePick(event) {
        if (typeof Audio != 'undefined') selectSound.play()
        pickedCoor.set(event.detail.coor)
        pickedKoma.set(event.detail.kind)
        control.set(1)
	}
    function handleMove(event) {
        if (typeof Audio != 'undefined') moveSound.play()
        if ($turn) {
            getKoma1=event.detail.text
        } else {
            getKoma2=event.detail.text
        }
        control.set(2)
    }
    function handleFinished() {
        pickedCoor.set(-1)
        pickedKoma.set('')
        turn.set(!$turn)
        control.set(0)
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