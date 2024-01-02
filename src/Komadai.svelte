<script>
    import {onMount} from 'svelte'
    import {tokensInfo,mochigomaArray,turn} from './stores.js'
    import { createEventDispatcher } from 'svelte';

    export let sente;
	const dispatch = createEventDispatcher();
    let mochigomas = {hisha:1, kaku:0, kin:2, gin:0, kei:0, kyo:0, fu:3}
    function pickKoma(koma) {
        if (sente===$turn){
            dispatch('pick', {
			    text: koma
		    })
        };
        dispatch('read', {
			text: $tokensInfo[koma].sound
		});
    }
    function readMochigoma() {
        let player=''
        if (sente){
            player='せん'
        }else{
            player='ご'
        }
        let content='';
        for (let koma of $mochigomaArray) {
            const num=mochigomas[koma]
            if (num>0){
                content=content.concat($tokensInfo[koma].sound)
                if (num>1){
                    content=content.concat(num)
                }
                content=content.concat('、')
            }
        }
		dispatch('read', {
			text: player + 'てのもちごまは' + content + 'です'
		});
	}
    
</script>

<div class="komadai" class:gote={!sente} on:click={readMochigoma}>
    {#each $mochigomaArray as koma}
		{#if mochigomas[koma] > 0}
	        <img src={$tokensInfo[koma].pic} alt={$tokensInfo[koma].sound} on:click|stopPropagation={pickKoma(koma)} />
            {#if mochigomas[koma] > 1}
	            <span>{mochigomas[koma]}</span>
            {/if}
        {/if}
	{/each}
</div>

<style>
    .komadai{
        background-color:beige
    }
    .gote {
        transform:rotate(180deg);
    }
</style>