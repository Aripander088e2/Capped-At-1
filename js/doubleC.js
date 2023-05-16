MAIN.double = {
    formula() {
        let r = player.reset

        let x = Math.min(1,r**(2+tmp.glyph.eff[2])*Math.log10(r+1)/160/tmp.double_penalty[1])

        if (hasResearchUpg(18)) x *= 2

        return x
    },
    progress() {
        return tmp.double_formula
    },

    reset() {
        if (tmp.double_formula >= 1) {
            player.double_unl = true
            player.double++
            this.doReset()
        }
    },
    doReset(order='b2') {
        player.p = E(0)
        if (player.double < 6) player.p_time = 0
        player.reset = 0
        if (player.triple < 4 || order == 'b3') {
            player.res_upgs = []
            player.res_spent = []
        }
        player.res_charge = []

        updateTemp()
    },

    penalty() {
        let r = player.double
        let b = r
        let pen = tmp.triple_penalty

        if (b>7) b = (b/7)**2*7

        b += pen[1]

        if (hasResearchUpg(12)) b -= researchUpgEff(12,0)

        b *= pen[0]

        b /= tmp.glyph.eff[3]

        let p = r > 2 ? 2**(softcap(b,5,.5,0)-1)/10+1 : b*.1+1

        let q = r > 3 ? 1.7**b : 1.48**b

        if (hasResearchUpg(14)) q **= 0.85

        if (hasResearchUpg(14) && chargedResUpg(14)) p **= 0.85

        return [p,softcap(q,100,0.25,0)]
    },

    charge_formula() {
        let c = player.charge, b = 1, p = 1

        let psi = 1

        if (hasResearchUpg(6)) psi += researchUpgEff(6,0)
        if (hasResearchUpg(7)) psi += researchUpgEff(7,0)

        psi *= tmp.glyph.eff[1]

        if (hasResearchUpg(12)) psi **= chargedResUpg(12)?1.4:1.25

        tmp.double_psi = psi

        for (let y = 0; y < tmp.charge_len[0]; y++) {
            bb = 0
            for (let x = 0; x < tmp.charge_len[1]; x++) {
                bb += c[y][x]*psi
            }
            b *= bb+1
        }

        for (let x = 0; x < tmp.charge_len[1]; x++) {
            pp = 0
            for (let y = 0; y < tmp.charge_len[0]; y++) {
                pp += c[y][x]*psi
            }
            p *= pp+1
        }

        let x = Decimal.pow(b,player.double*p)

        let sp = E('ee5')

        if (player.double>=10) sp = sp.pow(5)
        if (hasResearchUpg(16)) sp = sp.pow(researchUpgEff(16))

        tmp.double_formula_ss = sp

        return x.softcap(sp,hasResearchUpg(17)?0.86:0.8,2)
    },

    milestone: [
        {
            r: 1,
            desc: `<b>Compacted Box</b> will no longer reset its time.`,
        },{
            r: 1,
            desc: `Increase <b>Charge Core</b>'s row by <b>1</b>.`,
        },{
            r: 1,
            desc: `<b>Charge Core</b> decreases <b>75%</b> slower.`,
        },{
            r: 6,
            desc: `Automate <b>Compacted Box</b>. <b>Double Compacted Box</b> will no longer reset <b>Compacted Box</b>'s time.`,
        },{
            r: 1,
            desc: `Increase <b>Charge Core</b>'s column by <b>1</b>. <b>Charge Core</b>'s inactive time is another <b>80%</b> slower.`,
        },{
            r: 9,
            desc: `Add <b>1</b> to <b>Upgrade Charger</b>. Inactive charge will no longer decrease.`,
        },{
            r: 10,
            desc: `<b>Core Formula</b>'s effect softcap starts <b>^5</b> later.`,
        },{
            r: 1,
            desc: `Increase <b>Charge Core</b>'s row by <b>1</b>. Add <b>1</b> to <b>Upgrade Charger</b>.`,
        },{
            r: 2,
            desc: `Increase <b>Charge Core</b>'s column by <b>1</b>. Add <b>1</b> to <b>Upgrade Charger</b>.`,
        },{
            r: 13,
            desc: `Add <b>1</b> to <b>Upgrade Charger</b> per 2 <b>Double Compacted Boxes</b>, starting at 13.`,
        },{
            r: 18,
            desc: `Increase <b>Charge Core</b>'s row and column by <b>1</b>.`,
        },
    ],
}

tmp_update.push(()=>{
    let md = MAIN.double
    
    tmp.double_penalty = md.penalty()

    tmp.double_formula = md.formula()

    tmp.double_progress = md.progress()

    tmp.charge_len = [2,2]

    if (player.double >= 4) tmp.charge_len[0] += 1
    if (player.double >= 7) tmp.charge_len[1] += 1
    if (player.double >= 11) tmp.charge_len[0] += 1
    if (player.double >= 12) tmp.charge_len[1] += 1
    if (player.double >= 18) {
        tmp.charge_len[0] += 1
        tmp.charge_len[1] += 1
    }

    tmp.charge_formula = md.charge_formula()
})
