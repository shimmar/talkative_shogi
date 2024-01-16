<dialog bind:this={gameSetDialog} on:click={() => location.reload()}>
    <div class="imageContainer gote">
        <img src={'/' + goteImg + '.png'} class="resultImg" />
    </div>
    <div class="imageContainer">
        <img src={'/' + senteImg + '.png'} class="resultImg" />
    </div>
</dialog>

<style>
    .resultImg {
        max-width: 500px;
        width: 80%
    }
    .gote {
        transform:rotate(180deg);
    }
    .imageContainer {
        text-align: center;
    }
</style>

<script>
    export let gameSetDialog
    /**
	 * @type {string}
	 */
    export let winnerStr
    $: senteImg = winnerStr === '先手' ? 'win' : 'lose'
    $: goteImg = winnerStr === '後手' ? 'win' : 'lose'
</script>