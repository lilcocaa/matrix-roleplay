google.charts.load('current', { packages: ["orgchart"] });
google.charts.setOnLoadCallback(drawCharts);

const payments = {
    manager: '$ 25.000',
    lider: '$ 15.000',
    mod_1: '$ 10.000',
    mod_2: '$ 8.000',
    mod_3: '$ 6.000',
    sup_1: '$ 4.000',
    sup_2: '$ 3.000',
    sup_3: '$ 2.000',
};

function generateData(rows, roles, levels, titles) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('string', 'Manager');
    data.addColumn('string', 'ToolTip');

    data.addRows(rows);

    var classes = {
        styleTitle: `
            background: #002600;
            color: #fff;
            border-radius: 0;
            border: 1px solid #000d00;
        `,

        // background: #d2a0f5;
        stylePerson: `
            background: #ffffff;
            color: #141517;
            border-radius: 0;
            border: 1px solid #666666;
        `,

        styleRole: `
            background: #005900;
            color: #fff;
            border-radius: 0;
            border: 1px solid #004000;
        `,

        styleLevel: `
            background: #008c00;
            color: #fff;
            border-radius: 0;
            border: 1px solid #007300;
        `,
    };

    for (let i in rows) {
        const index = parseInt(i);
        var className = 'stylePerson';

        if (roles.indexOf(index) !== -1) className = 'styleRole';
        if (levels.indexOf(index) !== -1) className = 'styleLevel';
        if (titles.indexOf(index) !== -1) className = 'styleTitle';

        // console.log(index, roles.indexOf(index), className);
        data.setRowProperty(index, 'style', classes[className]);
    }
    // console.log('--------------------');

    return data;
}

function drawChart(element, data) {
    var chart = new google.visualization.OrgChart(document.getElementById(element));
    chart.draw(data, { 'allowHtml': true });
}

function drawCharts() {
    var dataHierarquia = generateData(
        [
            [
                'DIRETORES',
                '',
                '',
            ],
            [
                {
                    v: `GERENTES`,
                    f: `GERENTE<div style="font-weight: bold;">${payments.manager}</div>`,
                },
                'DIRETORES',
                '',
            ],
            [
                'MODERADORES',
                'GERENTES',
                '',
            ],
            [
                {
                    v: 'MOD LIDER',
                    f: `MOD LIDER<div style="font-weight: bold;">${payments.lider}</div>`,
                },
                'MODERADORES',
                '',
            ],
            [
                {
                    v: 'MOD NV 1',
                    f: `MOD NV 1<div style="font-weight: bold;">${payments.mod_1}</div>`,
                },
                'MOD LIDER',
                '',
            ],
            [
                {
                    v: 'MOD NV 2',
                    f: `MOD NV 2<div style="font-weight: bold;">${payments.mod_2}</div>`,
                },
                'MOD NV 1',
                '',
            ],
            [
                {
                    v: 'MOD NV 3',
                    f: `MOD NV 3<div style="font-weight: bold;">${payments.mod_3}</div>`,
                },
                'MOD NV 2',
                '',
            ],
            [
                'SUPORTES',
                'MOD NV 3',
                '',
            ],
            [
                {
                    v: 'SUP NV 1',
                    f: `SUP NV 1<div style="font-weight: bold;">${payments.sup_1}</div>`,
                },
                'SUPORTES',
                '',
            ],
            [
                {
                    v: 'SUP NV 2',
                    f: `SUP NV 2<div style="font-weight: bold;">${payments.sup_2}</div>`,
                },
                'SUP NV 1',
                '',
            ],
            [
                {
                    v: 'SUP NV 3',
                    f: `SUP NV 3<div style="font-weight: bold;">${payments.sup_3}</div>`,
                },
                'SUP NV 2',
                '',
            ],
        ],
        [1, 2, 7],
        [3, 4, 5, 6, 8, 9, 10],
        [0]
    );

    drawChart('chart_div_hierarquia', dataHierarquia);

    var dataDiretores = generateData(
        [
            [
                'DIRETORIA',
                '',
                '',
            ],
            // [
            //     {
            //         'v': 'DIRETOR-INOVACAO',
            //         'f': 'DIRETOR INOVA????O'
            //     },
            //     'DIRETORIA',
            //     '',
            // ],
            [
                {
                    'v': 'DIRETOR-DISCORD',
                    'f': 'DIRETOR DISCORD'
                },
                'DIRETORIA',
                '',
            ],
            [
                {
                    'v': 'DIRETOR-GAME',
                    'f': 'DIRETOR GAME'
                },
                'DIRETORIA',
                '',
            ],
            [
                {
                    'v': 'DIRETOR-DONATES',
                    'f': 'DIRETOR DONATES'
                },
                'DIRETORIA',
                '',
            ],
            // [
            //     {
            //         'v': 'DIRETOR-INOVACAO-1',
            //         'f': 'Caique'
            //     },
            //     'DIRETOR-INOVACAO',
            //     '',
            // ],
            [
                {
                    'v': 'DIRETOR-DISCORD-1',
                    'f': 'Leandro'
                },
                'DIRETOR-DISCORD',
                '',
            ],
            [
                {
                    'v': 'DIRETOR-GAME-1',
                    'f': 'Renan'
                },
                'DIRETOR-GAME',
                '',
            ],
            [
                {
                    'v': 'DIRETOR-DONATES-1',
                    'f': 'Camilla'
                },
                'DIRETOR-DONATES',
                '',
            ],
        ],
        [
            1,
            2,
            3,
        ],
        [],
        [0]
    );

    drawChart('chart_div_diretores', dataDiretores);

    const squads = [
        {
            id: 'SQUAD-A',
            name: 'TIME A',
            div: 'chart_div_squad_a',
            manager: 'Tony Bala | 12',
            lider: 'VAGO',
            mods_1: [
                'Kall??u Vieira | 22',
            ],
            mods_2: [
                'Tohke | 156', // *
            ],
            mods_3: [
                'Katsuky | 246',
            ],
            sups_1: [
                'VN | 18', // *
            ],
            sups_2: [
                'Diego Gamer | 707', // *
                'Delin | 695', // *
            ],
            sups_3: [
            ],
        },
        {
            id: 'SQUAD-B',
            name: 'TIME B',
            div: 'chart_div_squad_b',
            manager: 'Chuck Bass | 25',
            lider: 'VAGO',
            mods_1: [],
            mods_2: [
                'Gabriel Solen | 8', // *
                'Cel. Gustavo | 89',
            ],
            mods_3: [
                'Gumema | 10',
            ],
            sups_1: [
                // 'MataRindo | 7', // *
                'Mario ????????????? | 11', // *
            ],
            sups_2: [
                'CISKIM | 680', // *
                'Andre cabelin | 710', // *
            ],
            sups_3: [
                'Celular de Lim??o | 243',
            ],
        },
    ];

    /*

    ???? Tony Bala | 12

    ???? Chuck Bass | 25
        - eh gente mto boa
        - chama todos para entrar
        - leva mto pro pessoal
        - precisa aprender a se comunicar

    ???? Kall??u Vieira | 22
        - menino bom
        - um pouco ausente nos finais de semana

    ???? Gabriel Solen | 8 ++
        - atende mto bem

    ???? [PM] Tohke | 156 ++
        - joga bem
        - participativo

    ???? Delin | 695 ++
        - mto bom suporte
        - bom jogador
        - participativo

    ???? Diego Gamer | 707 ++
        - mto bom suporte
        - joga bem, e procura ajudar no jogo

    ???? Andre cabelin | 710 ++
        - ajuda bastante
        - joga bem

    ???? Celular de Lim??o | 243

    ???? CISKIM | 680 ++






    ???? Cel. Gustavo | 89
        - atende bem
        - mas reclama mto
        - se acha chefe
        - problemas com regras
        - interfere em papeis q nao eh dele

    ???? Gumema | 10
        - staff neutro
        - jogador ausente

    ???? MataRindo | 7
        - mtas adv
        - super god

    ???? Mario ????????????? | 11
        - o que ??? onde vive? do que se alimenta?


    ???? Katsuky | 246
        - muito ausente
        - esteve um periodo fora

    */

    for (var i in squads) {
        var rows = [];
        var roles = [];
        var levels = [];
        var titles = [];
        var index = 0;

        rows.push([
            {
                v: squads[i].id,
                f: squads[i].name,
            },
            '',
            '',
        ]);
        titles.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-MANAGER`,
                f: `???? GERENTE<div style="font-weight: bold;">${payments.manager}</div>`,
            },
            squads[i].id,
            '',
        ]);
        roles.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-MANAGER-1`,
                f: squads[i].manager,
            },
            `${squads[i].id}-MANAGER`,
            '',
        ]);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-MODERATORS`,
                f: `???? MODERADORES`,
            },
            `${squads[i].id}-MANAGER-1`,
            '',
        ]);
        roles.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-LIDER`,
                f: `???? LIDER<div style="font-weight: bold;">${payments.lider}</div>`,
            },
            `${squads[i].id}-MODERATORS`,
            '',
        ]);
        levels.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-LIDER-1`,
                f: squads[i].lider,
            },
            `${squads[i].id}-LIDER`,
            '',
        ]);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-MODERATOR-1`,
                f: `???? NV 1<div style="font-weight: bold;">${payments.mod_1}</div>`,
            },
            `${squads[i].id}-LIDER-1`,
            '',
        ]);
        levels.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-MODERATOR-2`,
                f: `???? NV 2<div style="font-weight: bold;">${payments.mod_2}</div>`,
            },
            `${squads[i].id}-LIDER-1`,
            '',
        ]);
        levels.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-MODERATOR-3`,
                f: `???? NV 3<div style="font-weight: bold;">${payments.mod_3}</div>`,
            },
            `${squads[i].id}-LIDER-1`,
            '',
        ]);
        levels.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-SUPORTS`,
                f: `???? SUPORTES`,
            },
            `${squads[i].id}-LIDER-1`,
            '',
        ]);
        roles.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-SUPORT-1`,
                f: `???? NV 1<div style="font-weight: bold;">${payments.sup_1}</div>`,
            },
            `${squads[i].id}-SUPORTS`,
            '',
        ]);
        levels.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-SUPORT-2`,
                f: `???? NV 2<div style="font-weight: bold;">${payments.sup_2}</div>`,
            },
            `${squads[i].id}-SUPORTS`,
            '',
        ]);
        levels.push(index);
        index++;

        rows.push([
            {
                v: `${squads[i].id}-SUPORT-3`,
                f: `???? NV 3<div style="font-weight: bold;">${payments.sup_3}</div>`,
            },
            `${squads[i].id}-SUPORTS`,
            '',
        ]);
        levels.push(index);
        index++;

        for (var j in squads[i].mods_1) {
            rows.push([
                {
                    v: `${squads[i].id}-MODERATOR-1-${j}`,
                    f: squads[i].mods_1[j],
                },
                `${squads[i].id}-MODERATOR-1`,
                '',
            ]);
            index++;
        }

        for (var j in squads[i].mods_2) {
            rows.push([
                {
                    v: `${squads[i].id}-MODERATOR-2-${j}`,
                    f: squads[i].mods_2[j],
                },
                `${squads[i].id}-MODERATOR-2`,
                '',
            ]);
            index++;
        }

        for (var j in squads[i].mods_3) {
            rows.push([
                {
                    v: `${squads[i].id}-MODERATOR-3-${j}`,
                    f: squads[i].mods_3[j],
                },
                `${squads[i].id}-MODERATOR-3`,
                '',
            ]);
            index++;
        }

        for (var j in squads[i].sups_1) {
            rows.push([
                {
                    v: `${squads[i].id}-SUPORT-1-${j}`,
                    f: squads[i].sups_1[j],
                },
                `${squads[i].id}-SUPORT-1`,
                '',
            ]);
            index++;
        }

        for (var j in squads[i].sups_2) {
            rows.push([
                {
                    v: `${squads[i].id}-SUPORT-2-${j}`,
                    f: squads[i].sups_2[j],
                },
                `${squads[i].id}-SUPORT-2`,
                '',
            ]);
            index++;
        }

        for (var j in squads[i].sups_3) {
            rows.push([
                {
                    v: `${squads[i].id}-SUPORT-3-${j}`,
                    f: squads[i].sups_3[j],
                },
                `${squads[i].id}-SUPORT-3`,
                '',
            ]);
            index++;
        }

        var data = generateData(rows, roles, levels, titles);

        drawChart(squads[i].div, data);
    }
}
