<dialog class:gote={!$turn} bind:this={toryoDialog}>
    <div>
        <p>投了しますか？</p>
    </div>
    <div>
        <button on:click={() => dispatch('cancel')}>キャンセル</button>
        <button on:click={() => dispatch('do')}>投了</button>
    </div>
</dialog>

<style>
    .gote {
        transform:rotate(180deg);
    }
</style>

<script>
    import {createEventDispatcher} from 'svelte'
    import {turn} from './stores.js'

    export let toryoDialog
    const dispatch = createEventDispatcher();

</script>