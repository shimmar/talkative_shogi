<dialog bind:this={gameSetDialog}>
    <div class="gote">
        <div>
            <p>{winnerStr}の勝ちです！</p>
        </div>
        <div>
            <button on:click={() => location.reload()}>新規対局</button>
        </div>
    </div>
    <div>
        <div>
            <p>{winnerStr}の勝ちです！</p>
        </div>
        <div>
            <button on:click={() => location.reload()}>新規対局</button>
        </div>
    </div>
</dialog>

<style>
    .gote {
        transform:rotate(180deg);
    }
</style>

<script>
    export let gameSetDialog
    /**
	 * @type {string}
	 */
    export let winnerStr
</script>