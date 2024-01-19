<script>
    import Board from './Board.svelte'
    import Komadai from './Komadai.svelte'
    import Toryo from './Toryo.svelte'
    import ToryoDialog from './ToryoDialog.svelte'
    import GameSetDialog from './GameSetDialog.svelte'
    import {control,turn,pickedCoor,pickedKoma} from './stores.js'

    let getKoma1 = ''
    let getKoma2 = ''
    let winnerStr = ''
    let toryo = false
    /**
	 * @type {{ showModal: () => ((e: CustomEvent<any>) => void) | null | undefined; close: () => ((e: CustomEvent<any>) => void) | null | undefined; }}
	 */
    let toryoDialog
    /**
	 * @type {{ showModal: () => ((e: CustomEvent<any>) => void) | null | undefined; }}
	 */
    let gameSetDialog
    /**
	 * @type {HTMLAudioElement}
	 */
    let selectSound
    /**
	 * @type {HTMLAudioElement}
	 */
    let moveSound
    /**
	 * @type {HTMLAudioElement}
	 */
    let cancelSound
    if (typeof Audio != 'undefined') {
        selectSound = new Audio('/select.mp3')
        selectSound.volume = 0.5
        selectSound.loop = false
        moveSound = new Audio('/move.mp3')
        moveSound.volume = 0.5
        moveSound.loop = false
        cancelSound = new Audio('/cancel.mp3')
        cancelSound.volume = 0.8
        cancelSound.loop = false
    }
    /**
	 * @param {string} text
	 */
    function readText(text) {
        const uttr = new SpeechSynthesisUtterance(text);
        uttr.lang = 'ja-JP';
        speechSynthesis.speak(uttr);
    }
    /**
	 * @param {{ detail: { text: string; }; }} event
	 */
    function handleRead(event) {
        readText(event.detail.text)
	}
    /**
	 * @param {{ detail: { coor: number; kind: string; }; }} event
	 */
    function handlePick(event) {
        if (typeof Audio != 'undefined') selectSound.play()
        pickedCoor.set(event.detail.coor)
        pickedKoma.set(event.detail.kind)
        control.set(1)
	}
    function handleCancel() {
        if (typeof Audio != 'undefined') cancelSound.play()
        pickedCoor.set(-1)
        pickedKoma.set('')
        control.set(0)
    }
    /**
	 * @param {{ detail: { text: string; }; }} event
	 */
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
    function showToryoDialog() {
        toryoDialog.showModal()
        readText('投了しますか？')
    }
    function doToryo() {
        toryoDialog.close()
        toryo = true
        gameSet()
    }
    function gameSet() {
        winnerStr = $turn===toryo ? '後手' :'先手'
        gameSetDialog.showModal()
        readText(winnerStr + 'の勝ちです！')
    }
</script>

<div class="main">
    <div class="edge gote">
        <Komadai sente={false} getKoma={getKoma2} on:read={handleRead} on:pick={handlePick} 
        on:finished={handleFinished} on:cancel={handleCancel} />
        <Toryo sente={false} on:click={showToryoDialog}/>
    </div>
    <Board on:read={handleRead} on:pick={handlePick} on:move={handleMove} on:cancel={handleCancel} on:tsumi={gameSet} />
    <div class="edge">
        <Komadai sente={true} getKoma={getKoma1} on:read={handleRead} on:pick={handlePick} 
        on:finished={handleFinished} on:cancel={handleCancel} />
        <Toryo sente={true} on:click={showToryoDialog}/>
    </div>
    <ToryoDialog bind:toryoDialog on:cancel={toryoDialog.close()} on:do={doToryo} />
    <GameSetDialog bind:gameSetDialog winnerStr={winnerStr} />
</div>

<style>
    .main{
        width:100%;
        margin: 0 auto;
    }
    .edge {
        display: flex;
    }
    .gote {
        transform:rotate(180deg);
    }
</style>