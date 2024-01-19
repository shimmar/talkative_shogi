<dialog class:gote={!$turn} bind:this={toryoDialog}>
    <div>
        <p id="toryoStatement">投了？</p>
    </div>
    <div>
        <button id="cancelBtn" on:click={() => dispatch('cancel')}>キャンセル</button>
        <button id="toryoFinalBtn" on:click={() => dispatch('do')}>投了</button>
    </div>
</dialog>

<style>
    .gote {
        transform:rotate(180deg);
    }
    #toryoStatement{
        font-size: 20vw
    }
    #cancelBtn{
        font-size: 9vw;
        background: #999999
    }
    #toryoFinalBtn{
        font-size: 9vw;
        background: #ff9999
    }
</style>

<script>
    import {createEventDispatcher} from 'svelte'
    import {turn} from './stores.js'

    export let toryoDialog
    const dispatch = createEventDispatcher();

</script>