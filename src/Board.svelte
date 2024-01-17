<script>
    import {onMount,createEventDispatcher} from 'svelte'
    import {tokensInfo,control,turn,pickedCoor,pickedKoma} from './stores.js'

    const dispatch = createEventDispatcher();

    /** @type {Object.<number,{player: boolean, kind: string, movable: Set<number>}>} */
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
    let senteKing = 59, goteKing = 51, checked = false, tsumi = false
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
        if (row(i) !== 0) {
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
                fuExists.add(col(coor))
            }
        }
    }
    let pickedMovable=new Set()
    $: {
        if ($control === 1) {
        switch ($pickedCoor) {
            case 0:
                /** @type {number[]} */
                let tmpBlanks = []
                if (!checked) tmpBlanks = [...blanks]
                switch ($pickedKoma) {
                    case 'kei':
                        if ($turn) {
                            tmpBlanks = tmpBlanks.filter(coor => row(coor) > 2)
                        } else {
                            tmpBlanks = tmpBlanks.filter(coor => row(coor) < 8)
                        }
                        break
                    case 'kyo':
                        if ($turn) {
                            tmpBlanks = tmpBlanks.filter(coor => row(coor) > 1)
                        } else {
                            tmpBlanks = tmpBlanks.filter(coor => row(coor) < 9)
                        }
                        break
                    case 'fu':
                        if ($turn) {
                            tmpBlanks = tmpBlanks.filter(coor => row(coor) > 1)
                        } else {
                            tmpBlanks = tmpBlanks.filter(coor => row(coor) < 9)
                        }
                        tmpBlanks = tmpBlanks.filter(coor => !fuExists.has(col(coor)))
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
        if (coor > 10 && coor < 100 && row(coor) !== 0) {
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
	 * @param {number} coor
	 */
    function col(coor) {
        //座標の列を求める
        return Math.floor(coor / 10)
    }
    /**
	 * @param {number} coor
	 */
    function row(coor) {
        //座標の行を求める
        return coor % 10
    }
    function renewMovable(){
        //Step1 王手を考慮しない可動域計算、着手側利き場所算出、王手駒とピン/被ピン駒抽出
        //指し終わった側の可動域には味方駒がいるマスを含む
        // TODO 上記について、これから指す側についても同様の扱いでよさそう(selectGrid内で再度判定しているため)。要確認
        
        const targetKingPosition = $turn ? goteKing : senteKing
        /** @type {number[]} */
        let reachedArray = new Array()
        /** @type {Object.<number, Set<number>>} */
        let checkKomas = {}
        /** @type {Object.<number, Set<number>>} */
        let pinCheck = {}

        /**
	     * @param {boolean} player
	     * @param {number} cur
	     * @param {number} step
	     */
        function checkLongMove(player, cur, step) {
            //遠隔系の可動範囲計算
            let coor = cur + step
            let coors = [], conFlag = true, pinFlag = false, pinned = 0
            while (checkExistance(coor) && conFlag) {
                switch (checkCondition(player, coor)){
                    case 1:
                        if (player === $turn) coors.push(coor)
                        conFlag = false
                        break
                    case 0:
                        coors.push(coor)
                        coor += step
                        break
                    case -1:
                        coors.push(coor)
                        if (player === $turn) {
                            if (coor === targetKingPosition) {
                                let checkCoors = new Set(coors).add(cur)
                                checkKomas[cur] = checkCoors
                                if (checkExistance(coor+=step)) reachedArray.push(coor)
                            } else{
                                pinned = coor
                                coor += step
                                pinFlag = true
                            } 
                        }
                        conFlag = false
                        break
                }
            }
            if (pinFlag) {
                let pinCoors = Array.from(coors)
                pinCoors.push(cur)
                while (checkExistance(coor) && pinFlag) {
                    switch (checkCondition(player, coor)) {
                        case 1:
                            pinFlag = false
                            break
                        case 0:
                            pinCoors.push(coor)
                            coor += step
                            break
                        case -1:
                            if (coor === targetKingPosition) {
                                pinCoors.push(coor)
                                pinCheck[pinned] = new Set(pinCoors)
                            }
                            pinFlag = false
                            break
                    }
                }
            }
            return coors
        }
        
        for (let current in contents){
            let player=contents[current].player;
            let kind=contents[current].kind;
            /** @type {number[]} */
            let movable=new Array();
            let currentInt=parseInt(current);
            /** @type {number[]} */
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
                    if (!(player !== $turn && checkCondition(player, dest) === 1)){
                        movable.push(dest)
                        if (player === $turn && dest === targetKingPosition) checkKomas[currentInt] = new Set([dest])
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
            const movableSet = new Set(movable)
            contents[current].movable= movableSet
            if (player === $turn) reachedArray = [...reachedArray, ...movable]
        }
        const reached = new Set(reachedArray)

        //Step2 相手玉可動域修正
        const kingMovable = Array.from(contents[targetKingPosition].movable)
        const kingMovableSet = new Set(kingMovable.filter(coor => !reached.has(coor)))
        contents[targetKingPosition].movable = kingMovableSet

        //Step3 ピンされた駒の動きを制限
        for (let [coorStr, rest] of Object.entries(pinCheck)) {
            let coor = parseInt(coorStr)
            const originalMovable = Array.from(contents[coor].movable)
            contents[coor].movable = new Set(originalMovable.filter(element => rest.has(element)))
        }

        //Step4 王手されている場合候補手制限と詰み判定
        checked = true
        const checkKomasKey = Object.keys(checkKomas)
        if (checkKomasKey.length >= 2) {
            if (kingMovableSet.size === 0) tsumi = true
            else {
                for (let current in contents){
                    let info = contents[current]
                    if (info.player !== $turn && info.kind !== 'gyoku') info.movable = new Set()
                }
            }
        } else if (checkKomasKey.length === 1) {
            let tsumiFlag = true
            /** @type {Set<number>} */
            let rest = checkKomas[parseInt(checkKomasKey[0])]
            for (let currentStr in contents) {
                const cur = parseInt(currentStr)
                const info = contents[cur];
                if (info.player !== $turn) {
                    let currentMovable = Array.from(info.movable)
                    if (cur !== targetKingPosition) {
                        currentMovable = currentMovable.filter(element => rest.has(element))
                        contents[cur].movable = new Set(currentMovable)
                    }
                    if (currentMovable.length > 0) tsumiFlag = false
                }
            }
            if (tsumiFlag) tsumi = true
        } else checked = false
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
                    if (finalKoma === 'gyoku') {
                        if ($turn) senteKing = coor
                        else goteKing = coor
                    }
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
                                if (($turn && row(coor) === 1) || (!$turn && row(coor) === 9)) {
                                    promotable = true
                                    promotion = true
                                }
                                break
                            case 'kei':
                                if (($turn && row(coor) < 3) || (!$turn && row(coor) > 7)) {
                                    promotable = true
                                    promotion = true
                                }
                                break
                        }
                        if (!promotion) {
                            if ($turn && (row($pickedCoor) < 4 || row(coor) < 4)) promotable = true
                            else if (!$turn && (row($pickedCoor) > 6 || row(coor) > 6)) promotable = true
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
                renewMovable()
                dispatch('move', {
                    text: getKoma
                })
                let player = ''
                if ($turn) player = '先手、'
                else player = '後手、'
                koma = $tokensInfo[$pickedKoma].sound
                dispatch('read', {
			        text: player + coorStr.slice(0,1) + ' ' + coorStr.slice(1) + koma + promotionSound
		        });
                if (tsumi) dispatch('tsumi')
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
        turn.set(!$turn)
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
        <div class="promDialogContent">
            <img id="nariImg" src={nariImgSrc} alt={nariImgAlt}>
            <img id="narazuImg" src={narazuImgSrc} alt={narazuImgAlt}>
        </div>
    </dialog>
</div>

<style>
    .board {
        position: relative;
        margin: 0 auto;
    }
    .back {
        width: 100%;
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
    .promDialogContent {
        display: flex;
    }
</style>