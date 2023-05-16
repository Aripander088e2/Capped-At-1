const RES_UPGS = [
    {
        unl: ()=>true,
        desc: `Boost production based on <b>Compacted Box</b>.`,
        charged: `Boost production based on <b>Compacted Box</b> and <b>Double Compacted Box</b>.`,
        cost: E(1),
        effect() {
            let x = hasResearchUpg(14) ? Decimal.pow(player.reset+2,player.reset**2.5) : Decimal.pow(player.reset+2,player.reset/2+1)

            if (hasResearchUpg(4)) x = x.pow(8.5)

            if (chargedResUpg(0)) x = x.pow(player.double/2+1)

            if (player.triple >= 6) x = x.log10().add(10).log10().pow(3)

            return x
        },
        effDesc: x=>player.triple >= 6?"^"+format(x):formatMult(x),
    },{
        unl: ()=>true,
        desc: `Boost production based on <b>Points</b>.`,
        cost: E(2),
        effect() {
            let x = player.p.mul(tmp.penalty).add(1).log10().add(1)

            if (hasResearchUpg(14)) x = Decimal.pow(10,x.pow(0.75))

            x = x.pow(2.5)

            if (hasResearchUpg(4)) x = x.pow(16)

            if (player.triple >= 6) x = x.log10().add(10).log10().pow(2)

            return x
        },
        effDesc: x=>player.triple >= 6?"^"+format(x):formatMult(x),
    },{
        unl: ()=>player.reset>=3,
        desc: `Decrease <b>Compacted Box</b>'s penalty base based on unspent <b>Research Points</b>.`,
        charged: `Decrease <b>Compacted Box</b>'s penalty base based on total <b>Research Points</b>.`,
        cost: E(2),
        effect() {
            let c = chargedResUpg(2)

            let x = (c ? tmp.totalResearch.pow(2) : tmp.unspentResearch).add(1).log10().mul(2.5)

            if (hasResearchUpg(5)) x = x.mul(researchUpgEff(16))

            if (hasResearchUpg(14)) x = x.pow(1.2)

            return x.softcap(2.5,hasResearchUpg(10)?0.75:0.5,0).toNumber()
        },
        effDesc: x=>"-"+format(x)+softcapHTML(x,2.5),
    },{
        unl: ()=>player.reset>=4,
        desc: `Increase <b>Compacted Box</b>'s bonus base based on <b>Compacted Box</b>.`,
        charged: `Increase <b>Compacted Box</b>'s bonus base based on <b>Compacted Box</b> and <b>Double Compacted Box</b>.`,
        cost: E(5),
        effect() {
            let x = player.reset*.4

            if (chargedResUpg(3)) x *= player.double*.2+1

            if (chargedResUpg(5)) x *= researchUpgEff(5,1)

            if (x>=3) x = (x/3)**(hasResearchUpg(10)?.75:.5)*3

            return x
        },
        effDesc: x=>"+"+format(x,2)+softcapHTML(x,3),
    },{
        unl: ()=>player.reset>=6,
        desc: `First 2 <b>Research Upgrades</b> are stronger.`,
        cost: E(8),
    },{
        unl: ()=>player.reset>=9,
        desc: `Third <b>Research Upgrade</b> is stronger based on spent time in <b>Compacted Box</b>. <i>(capped at 5 minutes)</i>`,
        charged: `3-4 <b>Research Upgrades</b> are stronger based on spent time in <b>Compacted Box</b>.`,
        cost: E(10),
        effect() {
            let x = Math.log10(Math.min(chargedResUpg(5)?1/0:300,player.p_time)+1)/2+1

            return E(x**2).softcap(4,chargedResUpg(10)?2/3:1/3,0).toNumber()
        },
        effDesc: x=>formatMult(x)+" stronger"+softcapHTML(x,4),
    },{
        unl: ()=>player.reset>=13 && player.double>0,
        desc: `Increase <b>ψ</b> base by <b>Compacted Box</b>.`,
        charged: `Increase <b>ψ</b> base by <b>Compacted Box</b> and <b>Research Points</b>.`,
        cost: E(6),
        effect() {
            let r = player.reset

            if (chargedResUpg(6)) r *= tmp.totalResearch.add(1).log10().toNumber()+1

            if (r>16) r = (r/16)**(chargedResUpg(10)?.75:.5)*16

            let x = r*0.075

            if (chargedResUpg(14)) x = (x+1)**1.5-1

            return x
        },
        effDesc: x=>"+"+format(x)+softcapHTML(player.reset,16),
    },{
        unl: ()=>player.reset>=17 && player.double>0,
        desc: `Increase <b>ψ</b> base by <b>Double Compacted Box</b>.`,
        cost: E(10),
        effect() {
            let r = player.double

            let x = r*0.075

            if (hasResearchUpg(13)) x *= chargedResUpg(13) ? 4 : 2

            if (chargedResUpg(14)) x = (x+1)**1.75-1

            if (player.triple >= 6) x *= tmp.glyph.eff[1]

            return x
        },
        effDesc: x=>"+"+format(x),
    },{
        unl: ()=>player.reset>=17,
        desc: `Normal production is raised to the <b>1.25th</b> power. <i>(before division)</i>`,
        charged: `Normal production is raised to the <b>1.5th</b> power. <i>(before division)</i>`,
        cost: E(10),
    },{
        unl: ()=>player.reset>=18,
        desc: `Decrease <b>Compacted Box</b>'s penalty base based on <b>Core Formula</b>.`,
        cost: E(10),
        effect() {
            let x = tmp.charge_formula.add(1).log10().add(1).log10().mul(3)

            return x.toNumber()
        },
        effDesc: x=>"-"+format(x),
    },{
        unl: ()=>player.reset>=26,
        desc: `3-4 <b>Research Upgrades</b>' effect softcap is weaker.`,
        charged: `3-4, 6-7 <b>Research Upgrades</b>' effect softcap is weaker.`,
        cost: E(15),
    },{
        unl: ()=>player.reset>=27&&player.double>=5,
        desc: `<b>Compacted Box</b>'s penalty scaling is weaker.`,
        charged: `<b>Compacted Box</b>'s penalty scaling is more weaker.`,
        cost: E(20),
    },{
        unl: ()=>player.reset>=30&&player.double>=5,
        desc: `Decrease <b>Double Compacted Box</b>'s penalty base based on unspent <b>Research Points</b>.<br><b>ψ</b> base is raised to the <b>1.25th</b> power.`,
        charged: `Decrease <b>Double Compacted Box</b>'s penalty base based on total <b>Research Points</b>.<br><b>ψ</b> base is raised to the <b>1.4th</b> power.`,
        cost: E(20),
        effect() {
            let x = (chargedResUpg(12)?tmp.totalResearch.pow(4):tmp.unspentResearch).add(1).log10().div(10)

            return x.toNumber()
        },
        effDesc: x=>"-"+format(x),
    },{
        unl: ()=>player.reset>=40,
        desc: `Eighth <b>Research Upgrade</b> is twice as effective.`,
        charged: `Eighth <b>Research Upgrade</b> is quadrice as effective.`,
        cost: E(25),
    },{
        unl: ()=>player.reset>=60,
        desc: `First 3 <b>Research Upgrades</b> are overpowered. <b>Double Compacted Box</b>'s second penalty is weaker.`,
        charged: `First 3, 7-8 <b>Research Upgrades</b> are overpowered. <b>Double Compacted Box</b>'s penalty is weaker.`,
        cost: E(250),
    },{
        unl: ()=>player.reset>=75,
        desc: `<b>Compacted Box</b>'s penalty effect is dilated to the 0.8th power.`,
        cost: E(1000),
    },{
        unl: ()=>player.reset>=110,
        desc: `<b>Core Formula</b>'s effect softcap starts later based on <b>Compacted Box</b>.`,
        charged: `<b>Core Formula</b>'s effect softcap starts later based on <b>Compacted Box</b> and <b>Double Compacted Box</b>.`,
        cost: E(2000),
        effect() {
            let b = player.reset

            if (chargedResUpg(16)) b *= player.double+1

            let x = (b+1)**.4

            return x
        },
        effDesc: x=>"^"+format(x)+" later",
    },{
        unl: ()=>player.reset>=360,
        desc: `<b>Core Formula</b>'s effect softcap is weaker.`,
        cost: E(80000),
    },{
        unl: ()=>player.reset>=1000,
        desc: `<b>Double Compacted Box</b>'s claim formula is doubled.`,
        cost: E(700000),
    },
]

const RES_UPGS_LEN = RES_UPGS.length

function hasResearchUpg(i) { return player.res_upgs.includes(i) && RES_UPGS[i].unl() }
function researchUpgEff(i,def=1) { return tmp.resUpgs.effect[i]||def }
function chargedResUpg(i) { return player.res_charge.includes(i) }

function buyResearchUpg(i) {
    let cost = tmp.resUpgs.cost[i]

    if (tmp.unspentResearch.gte(cost) && !player.res_upgs.includes(i)) {
        player.res_upgs.push(Number(i))
        player.res_spent[i] = cost

        updateTemp()
    }
}

function revertResearchUpg(i) {
    if (!player.res_upgs.includes(i)) return

    player.res_upgs.splice(player.res_upgs.indexOf(i), 1)
    player.res_spent[i] = E(0)

    player.p = E(0)
    if (player.double < 3) player.p_time = 0


    updateTemp()
}

function chargeResearchUpg(i) {
    if (player.res_charge.includes(i)) {
        player.res_charge.splice(player.res_charge.indexOf(i), 1)

        player.p = E(0)
        if (player.double < 3) player.p_time = 0

        updateTemp()
    } else if (player.res_charge.length < tmp.charger_upgrade && RES_UPGS[i].charged) {
        player.res_charge.push(i)

        updateTemp()
    }
}

function respecResearch() {
    player.res_upgs = []
    player.res_spent = []

    player.p = E(0)
    if (player.double < 3) player.p_time = 0

    updateTemp()
}

function updateRUTemp() {
    tmp.charger_upgrade = 0
    if (player.double >= 9) tmp.charger_upgrade++
    if (player.double >= 11) tmp.charger_upgrade++
    if (player.double >= 12) tmp.charger_upgrade++
    if (player.double >= 13) tmp.charger_upgrade += Math.floor((player.double-11)/2)
    if (player.triple >= 5) tmp.charger_upgrade += player.triple-3

    let tru = tmp.resUpgs

    let d = player.res_upgs.length

    if (d>13) d = (d/13)**2*13
    tru.scale = 1 + d/2

    for (let x in RES_UPGS) {
        let ru = RES_UPGS[x]

        tru.cost[x] = ru.cost.mul(tru.scale).round()
        if (ru.effect) tru.effect[x] = ru.effect()
    }
}

tmp_update.push(()=>{
    updateRUTemp()
})
