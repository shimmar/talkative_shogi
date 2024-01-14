<div>
    <button on:click={() => dispatch('click')} disabled={sente !== $turn}>投了</button>
</div>

<script>
    import {createEventDispatcher} from 'svelte'
    import {turn} from './stores.js'
    /**
	 * @type {boolean}
	 */
     export let sente
    const dispatch = createEventDispatcher();
</script>