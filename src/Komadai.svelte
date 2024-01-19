<script>
    import {createEventDispatcher} from 'svelte'
    import {tokensInfo,mochigomaArray,turn,control,pickedCoor,pickedKoma} from './stores.js'

    /**
	 * @type {boolean}
	 */
    export let sente;
    /**
	 * @type {string}
	 */
    export let getKoma;
    
    $: player = sente ? '先手' : '後手'
	const dispatch = createEventDispatcher();
    let mochigomas = {hisha:0, kaku:0, kin:0, gin:0, kei:0, kyo:0, fu:0}

    /**
	 * @param {string} koma
	 */
    function pickKoma(koma) {
        if (sente===$turn){
            if ($control === 1 && $pickedCoor === 0 && $pickedKoma === koma) {
                dispatch('cancel')
            } else {
                dispatch('pick', {
			        kind: koma,
                    coor: 0
		        })
                dispatch('read', {
			        text: $tokensInfo[koma].sound
		        });
            }
        } else {
            dispatch('read', {
			    text: $tokensInfo[koma].sound
		    });
        }
    }
    function readMochigoma() {
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
        if (content){
            content=content.concat('です')
        } else{
            content='ありません'
        }
		dispatch('read', {
			text: player + 'のもちごまは' + content
		});
	}

    $: {
        if ($control === 2 && sente === $turn) {
            if (getKoma) {
                mochigomas[getKoma] += 1
            }
            if ($pickedCoor === 0) {
                mochigomas[$pickedKoma] -= 1
            }
            dispatch('finished');
        }
    }
</script>

<button on:click={readMochigoma} id="mochigomaBtn">持ち駒</button>
<div class="komadai" on:click={readMochigoma}>
    {#each $mochigomaArray as koma}
		{#if mochigomas[koma] > 0}
	        <img src={$tokensInfo[koma].pic} alt={$tokensInfo[koma].sound} on:click|stopPropagation={pickKoma(koma)} 
            class:selected={$turn === sente && $control === 1 && $pickedCoor === 0 && $pickedKoma === koma} 
            class="koma" />
            {#if mochigomas[koma] > 1}
	            <span id="komaCnt">{mochigomas[koma]}</span>
            {/if}
        {/if}
	{/each}
</div>

<style>
    #mochigomaBtn {
        width: 10%;
        font-size: 5vw;
        background: #00cc66;
    }
    .komadai{
        width: 90%;
        background-color:beige;
        display: flex;
        align-items: center;
    }
    .koma {
        width:11%;
    }
    .selected {
        border: 1vw solid #00ff00
    }
    #komaCnt {
        font-size: 4vw;
    }
</style>