<script>
    import {onMount,createEventDispatcher} from 'svelte'
    import {tokensInfo,control,turn,pickedCoor,pickedKoma} from './stores.js'

    const dispatch = createEventDispatcher();

    let contents={
        11:{player:false, kind:'kyo', movable: new Set()},
        13:{player:false, kind:'fu', movable: new Set()},
        17:{player:true, kind:'fu', movable: new Set()},
        19:{player:true, kind:'kyo', movable: new Set()},
        21:{player:false, kind:'kei', movable: new Set()},
        22:{player:false, kind:'kaku', movable: new Set()},
        23:{player:false, kind:'fu', movable: new Set()},
        27:{player:true, kind:'fu', movable: new Set()},
        28:{player:true, kind:'hisha', movable: new Set()},
        29:{player:true, kind:'kei', movable: new Set()},
        31:{player:false, kind:'gin', movable: new Set()},
        33:{player:false, kind:'fu', movable: new Set()},
        37:{player:true, kind:'fu', movable: new Set()},
        39:{player:true, kind:'gin', movable: new Set()},
        41:{player:false, kind:'kin', movable: new Set()},
        43:{player:false, kind:'fu', movable: new Set()},
        47:{player:true, kind:'fu', movable: new Set()},
        49:{player:true, kind:'kin', movable: new Set()},
        51:{player:false, kind:'gyoku', movable: new Set()},
        53:{player:false, kind:'fu', movable: new Set()},
        57:{player:true, kind:'fu', movable: new Set()},
        59:{player:true, kind:'gyoku', movable: new Set()},
        61:{player:false, kind:'kin', movable: new Set()},
        63:{player:false, kind:'fu', movable: new Set()},
        67:{player:true, kind:'fu', movable: new Set()},
        69:{player:true, kind:'kin', movable: new Set()},
        71:{player:false, kind:'gin', movable: new Set()},
        73:{player:false, kind:'fu', movable: new Set()},
        77:{player:true, kind:'fu', movable: new Set()},
        79:{player:true, kind:'gin', movable: new Set()},
        81:{player:false, kind:'kei', movable: new Set()},
        82:{player:false, kind:'hisha', movable: new Set()},
        83:{player:false, kind:'fu', movable: new Set()},
        87:{player:true, kind:'fu', movable: new Set()},
        88:{player:true, kind:'kaku', movable: new Set()},
        89:{player:true, kind:'kei', movable: new Set()},
        91:{player:false, kind:'kyo', movable: new Set()},
        93:{player:false, kind:'fu', movable: new Set()},
        97:{player:true, kind:'fu', movable: new Set()},
        99:{player:true, kind:'kyo', movable: new Set()},
    }
    /**
	 * @type {HTMLElement}
	 */
    let promotionDialog
    /**
	 * @type {HTMLElement}
	 */
    let nariImg
    /**
	 * @type {HTMLElement}
	 */
    let narazuImg

    let nariImgSrc = '', nariImgAlt = '', narazuImgSrc = '', narazuImgAlt = ''
    $: {
        if ($pickedKoma && $tokensInfo[$pickedKoma].promoted) {
            nariImgSrc = $tokensInfo[$tokensInfo[$pickedKoma].promoted].pic
            nariImgAlt = $tokensInfo[$tokensInfo[$pickedKoma].promoted].sound
            narazuImgSrc = $tokensInfo[$pickedKoma].pic
            narazuImgAlt = $tokensInfo[$pickedKoma].sound
        }
        else {
            nariImgSrc = ''
            nariImgAlt = ''
            narazuImgSrc = ''
            narazuImgAlt = ''
        }
    }

    /**
	 * @type {number[]}
	 */
    let allCoor=new Array()
    for (let i=11; i<100; i++) {
        if (i%10 !== 0) {
            allCoor.push(i)
        }
    }
    $: blanks = [...allCoor].filter(element => !new Set(Object.keys(contents).map(k => parseInt(k))).has(element))
    let fuExists = new Set()
    $: {
        fuExists = new Set()
        for (let coorStr of Object.keys(contents)) {
            const coor = parseInt(coorStr)
            const content = contents[coor]
            if (content.player === $turn && content.kind === 'fu') {
                fuExists.add(Math.floor(coor/10))
            }
        }
        console.log('fuExists:', fuExists)
    }
    let pickedMovable=new Set()
    $: {
        if ($control === 1) {
        switch ($pickedCoor) {
            case 0:
                console.log('$pickedKoma:', $pickedKoma)
                let tmpBlanks = [...blanks]
                switch ($pickedKoma) {
                    case 'kei':
                        if ($turn) {
                            tmpBlanks = tmpBlanks.filter(coor => coor%10>2)
                        } else {
                            tmpBlanks = tmpBlanks.filter(coor => coor%10<8)
                        }
                        break
                    case 'kyo':
                        if ($turn) {
                            tmpBlanks = tmpBlanks.filter(coor => coor%10>1)
                        } else {
                            tmpBlanks = tmpBlanks.filter(coor => coor%10<9)
                        }
                        break
                    case 'fu':
                        if ($turn) {
                            tmpBlanks = tmpBlanks.filter(coor => coor%10>1)
                        } else {
                            tmpBlanks = tmpBlanks.filter(coor => coor%10<9)
                        }
                        tmpBlanks = tmpBlanks.filter(coor => !fuExists.has(Math.floor(coor/10)))
                        break
                }
                pickedMovable = new Set(tmpBlanks)
                console.log(pickedMovable)
                break
            case -1:
                pickedMovable = new Set()
                break
            default:
                pickedMovable = contents[$pickedCoor].movable
                console.log(pickedMovable)
        }
        }
	}

    /**
	 * @param {number} coor
	 */
    function checkExistance(coor){
        //座標の存在確認
        if (coor>10 && coor<100 && coor%10 !== 0) {
            return true
        } else {
            return false
        }
    }
    /**
	 * @param {boolean} player
	 * @param {number} coor
	 */
    function checkCondition(player, coor){
        //playerから見たcoorの状況を返す
        //味方がいたら1、空いていたら0、敵がいたら-1
        if (coor in contents){
            if (contents[coor].player === player){
                return 1
            }else{
                return -1
            }
        }else{
            return 0
        }
    }
    /**
	 * @param {boolean} player
	 * @param {number} cur
	 * @param {number} step
	 */
    function checkLongMove(player, cur, step) {
        //遠隔系の可動範囲計算
        let coor = cur+step
        let coors = []
        while (true) {
            if (!checkExistance(coor)) return coors
            switch (checkCondition(player, coor)){
                case 1:
                    return coors
                case 0:
                    coors.push(coor)
                    coor=coor+step
                    break
                case -1:
                    coors.push(coor)
                    return coors
            }
        }
    }
    function renewMovable(){
        for (let current in contents){
            let player=contents[current].player;
            let kind=contents[current].kind;
            let movable=new Array();
            let currentInt=parseInt(current);
            let candidate=new Array();
            // 近接系の可動マス計算
            switch(kind){
                case 'fu':
                    candidate=[-1]
                    break
                case 'kei':
                    candidate=[-12,8]
                    break
                case 'gin':
                    candidate=[-11,-9,-1,9,11]
                    break
                case 'kin':
                case 'narigin':
                case 'narikei':
                case 'narikyo':
                case 'to':
                    candidate=[-11,-10,-1,1,9,10]
                    break
                case 'gyoku':
                    candidate=[-11,-10,-9,-1,1,9,10,11]
                    break
                case 'ryu':
                    candidate=[-11,-9,9,11]
                    break
                case 'uma':
                    candidate=[-10,-1,1,10]
            }
            if (!player){
                candidate=candidate.map(c => c*-1)
            }
            for (let cdd of candidate){
                const dest=currentInt+cdd
                if (checkExistance(dest)){
                    if (checkCondition(player, dest) < 1){
                        movable.push(dest)
                    }
                }
            }
            //遠隔系の可動マス計算
            switch(kind){
                case 'kyo':
                    let step=-1
                    if (!player) step =1
                    movable = movable.concat(checkLongMove(player, currentInt, step))
                    break
                case 'hisha':
                case 'ryu':
                    movable = movable.concat(checkLongMove(player, currentInt, -1)).concat(checkLongMove(player, currentInt, 1)).concat(checkLongMove(player, currentInt, -10)).concat(checkLongMove(player, currentInt, 10))
                    break
                case 'kaku':
                case 'uma':
                    movable = movable.concat(checkLongMove(player, currentInt, -11)).concat(checkLongMove(player, currentInt, -9)).concat(checkLongMove(player, currentInt, 9)).concat(checkLongMove(player, currentInt, 11))
            }
            contents[current].movable= new Set(movable)
        }
    }

    function selectPromotion() {
        promotionDialog.showModal()
        return new Promise(resolve => {
            nariImg.onclick = () => resolve(true);
            narazuImg.onclick = () => resolve(false);
        });
    }

    /**
	 * @param {number} coor
	 */
    async function selectGrid(coor) {
        let info = contents[coor]
        const coorStr = String(coor), cond = checkCondition($turn, coor)
        let koma = ''
        if (cond === 1) {
            if ($pickedCoor === coor) {
                dispatch('cancel')
            } else {
                dispatch('pick', {
                    kind: info.kind,
			        coor: coor
		        })
                dispatch('read', {
			        text: coorStr.slice(0,1) + ' ' + coorStr.slice(1) + $tokensInfo[info.kind].sound
		        });
            }
        } else if ($control === 0) {
            if (cond === -1) {
                koma = $tokensInfo[info.kind].sound
            }
            dispatch('read', {
			    text: coorStr.slice(0,1) + ' ' + coorStr.slice(1) + koma
		    });
        } else {
            if (pickedMovable.has(coor)) {
                let getKoma = '', promotionSound = ''
                if ($pickedCoor > 0) {
                    //動かした場合
                    let promotion = false, promotable = false, finalKoma = $pickedKoma
                    if (cond === -1) {
                        getKoma = info.kind
                        let demoted = $tokensInfo[getKoma].demoted
                        if (demoted) getKoma = demoted
                    }
                    let promoted = $tokensInfo[$pickedKoma].promoted
                    if (promoted) {
                        //成れる駒の場合
                        switch ($pickedKoma) {
                            case 'fu':
                            case 'kyo':
                                if (($turn && coor % 10 === 1) || (!$turn && coor % 10 === 9)) {
                                    promotable = true
                                    promotion = true
                                }
                                break
                            case 'kei':
                                if (($turn && coor % 10 < 3) || (!$turn && coor % 10 > 7)) {
                                    promotable = true
                                    promotion = true
                                }
                                break
                        }
                        if (!promotion) {
                            if ($turn && ($pickedCoor%10<4 || coor%10<4)) promotable = true
                            else if (!$turn && ($pickedCoor%10>6 || coor%10>6)) promotable = true
                            if (promotable) {
                                promotion = await selectPromotion()
                                promotionDialog.close()
                            }
                        }
                        if (promotion) finalKoma = promoted
                        if (promotable && promotion) promotionSound = 'なり'
                        else if (promotable && !promotion) promotionSound = 'ならず'
                    }
                    contents[coor] = {player:$turn, kind:finalKoma, movable: new Set()}
                    delete contents[$pickedCoor]
                } else {
                    //打った場合
                    contents[coor] = {player:$turn, kind:$pickedKoma, movable: new Set()}
                }
                renewMovable() //TODO ここで相手玉の詰み判定
                dispatch('move', {
                    text: getKoma
                })
                let player = ''
                if ($turn) player = 'せんて、'
                else player = 'ごて、'
                koma = $tokensInfo[$pickedKoma].sound
                dispatch('read', {
			        text: player + coorStr.slice(0,1) + ' ' + coorStr.slice(1) + koma + promotionSound
		        });
            } else {
                if (cond === -1) {
                    koma = $tokensInfo[info.kind].sound
                }
                dispatch('read', {
			        text: coorStr.slice(0,1) + ' ' + coorStr.slice(1) + koma
		        });
            }
        }
    }

    onMount(() => {
        promotionDialog = document.getElementById('promotionDialog')
        nariImg = document.getElementById('nariImg')
        narazuImg = document.getElementById('narazuImg')
		renewMovable()
	});

</script>

<div class="board">
    <img src="/board.png" alt="" class="back">
    {#each [1,2,3,4,5,6,7,8,9] as row}
        <div>
        {#each [9,8,7,6,5,4,3,2,1] as col}
            {#if col*10+row in contents}
                <img src={$tokensInfo[contents[col*10+row].kind].pic} 
                alt={String(col) + ' ' + String(row) + $tokensInfo[contents[col*10+row].kind].sound}
                class:gote={!contents[col*10+row].player}
                class:selected={$control === 1 && $pickedCoor === col*10+row} class="koma"
                style="right:{1.6+(col-1)*10.8}%; top:{1.6+(row-1)*10.8}%"
                on:click={() => selectGrid(col*10+row)}>
            {:else}
                <button class="koma blank" 
                style="right:{1.6+(col-1)*10.8}%; top:{1.6+(row-1)*10.8}%"
                on:click={() => selectGrid(col*10+row)}>{String(col) + ' ' + String(row)}</button>
            {/if}
        {/each}
        </div>
	{/each}
    <dialog id="promotionDialog" class:gote={!$turn}>
        <div class="dialog">
            <img id="nariImg" src={nariImgSrc} alt={nariImgAlt}>
            <img id="narazuImg" src={narazuImgSrc} alt={narazuImgAlt}>
        </div>
    </dialog>
</div>

<style>
    .board {
        position: relative;
        display: inline-block;
    }
    .back {
        display: block;
        max-width: 100%;
        height: auto;
    }
    .gote {
        transform:rotate(180deg);
    }
    .koma {
        position: absolute;
        width:10%
    }
    .blank {
        height:10%;
        opacity:0
    }
    .selected {
        border: 3px solid #00ff00
    }
    .dialog {
        display: flex;
    }
</style>