<div>
    <button on:click={clickBtn}>投了</button>
</div>

<script>
    import {createEventDispatcher} from 'svelte'
    export let sente
    const dispatch = createEventDispatcher();
    function clickBtn() {
        dispatch('click')
    }
</script>