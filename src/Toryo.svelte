<button on:click={() => dispatch('click')} disabled={sente !== $turn} id="toryoBtn">投了</button>

<script>
    import {createEventDispatcher} from 'svelte'
    import {turn} from './stores.js'
    /**
	 * @type {boolean}
	 */
     export let sente
    const dispatch = createEventDispatcher();
</script>

<style>
    #toryoBtn {
        font-size: 5vw;
        background: #ff9999
    }
</style>