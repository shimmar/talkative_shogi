<script>
    import {onMount,createEventDispatcher} from 'svelte'
    import {tokensInfo,mochigomaArray,turn,controll,pickedCoor,pickedKoma} from './stores.js'

    /**
	 * @type {boolean}
	 */
    export let sente;
    /**
	 * @type {string}
	 */
    export let getKoma;
	const dispatch = createEventDispatcher();
    let mochigomas = {hisha:1, kaku:0, kin:2, gin:0, kei:1, kyo:1, fu:3}

    /**
	 * @param {string} koma
	 */
    function pickKoma(koma) {
        if (sente===$turn){
            dispatch('pick', {
			    kind: koma,
                coor: 0
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
        if (content){
            content=content.concat('です')
        } else{
            content='ありません'
        }
		dispatch('read', {
			text: player + 'てのもちごまは' + content
		});
	}

    $: {
        if ($controll === 2 && sente === $turn) {
            console.log(sente + 'koma deleted')
            if (getKoma) {
                mochigomas[getKoma] += 1
            }
            if ($pickedCoor === 0) {
                mochigomas[$pickedKoma] -= 1
            }
            dispatch('finished');
        }
    }
    
    //TODO sente===$turn && $pickedCoor===0のとき $pickedKomaを赤線で囲む
</script>

<div class="komadai" class:gote={!sente} on:click={readMochigoma}>
    {#each $mochigomaArray as koma}
		{#if mochigomas[koma] > 0}
	        <img src={$tokensInfo[koma].pic} alt={$tokensInfo[koma].sound} on:click|stopPropagation={pickKoma(koma)} class="koma" />
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
    .koma {
        width:10%
    }
</style>