function generateStars(value, max) {
    if (typeof max == 'undefined') max = 5;
    const html = [];

    for (let i = 0; i < value; i++) html.push('<span class="fa fa-star text-yellow-400"></span>');
    for (let i = value; i < max; i++) html.push('<span class="fa fa-star-o text-discord-600"></span>');

    return html.join(' ');
}

const categories = {
    'planos-vips': {
        title: 'Planos VIPs',
        slug: 'planos-vips',
        active: 1,
        showImage: 1,
        items: {
            '1001': {
                code: '1001',
                title: 'VIP Bronze',
                description: `
                    <h4 style="margin-bottom: 10px;">=== RECEBE NO ATO DA DOAÇÃO ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 2.500 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>$ 250.000</li>
                        <li>Carro VIP Classe B</li>
                        <li>+1 vaga na garagem</li>
                        <li>Limpa todos as multas acumuladas</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== RECEBE EM TODAS AS RENOVAÇÕES ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 2.500 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>Limpa todos as multas acumuladas</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== ENQUANTO FOR VIP, VOCÊ AINDA GANHA ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Tag de VIP</li>
                        <li>Test Drive para os novos veículos</li>
                        <li>Desconto exclusivo de 5% em qualquer outro item do site</li>
                    </ul>
                `,
                cost: 'R$ 90,00',
                discount: '25%',
                price: 'R$ 67,50',
                recurringPayment: 'R$ 20,00',
                image: '/img/vips/bronze-200.png',
                active: 1,
            },
            '1002': {
                code: '1002',
                title: 'VIP Prata',
                description: `
                    <h4 style="margin-bottom: 10px;">=== RECEBE NO ATO DA DOAÇÃO ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 5.500 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>$ 550.000</li>
                        <li>Carro VIP Classe B</li>
                        <li>+2 vaga na garagem</li>
                        <li>Limpa todos as multas acumuladas</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== RECEBE EM TODAS AS RENOVAÇÕES ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 5.500 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>Limpa todos as multas acumuladas</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== ENQUANTO FOR VIP, VOCÊ AINDA GANHA ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Tag de VIP</li>
                        <li>Test Drive para os novos veículos</li>
                        <li>Desconto exclusivo de 5% em qualquer outro item do site</li>
                    </ul>
                `,
                cost: 'R$ 125,90',
                discount: '30%',
                price: 'R$ 87,85',
                recurringPayment: 'R$ 38,00',
                image: '/img/vips/prata-200.png',
                active: 1,
            },
            '1003': {
                code: '1003',
                title: 'VIP Ouro',
                description: `
                    <h4 style="margin-bottom: 10px;">=== RECEBE NO ATO DA DOAÇÃO ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 12.000 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>$ 1.200.000</li>
                        <li>Carro VIP Classe B</li>
                        <li>+4 vaga na garagem</li>
                        <li>Limpa todos as multas acumuladas</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== RECEBE EM TODAS AS RENOVAÇÕES ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 12.000 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>Limpa todos as multas acumuladas</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== ENQUANTO FOR VIP, VOCÊ AINDA GANHA ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Tag de VIP</li>
                        <li>Test Drive para os novos veículos</li>
                        <li>Desconto exclusivo de 5% em qualquer outro item do site</li>
                    </ul>
                `,
                cost: 'R$ 165,90',
                discount: '35%',
                price: 'R$ 106,40',
                recurringPayment: 'R$ 54,00',
                image: '/img/vips/ouro-200.png',
                active: 1,
            },
            '1004': {
                code: '1004',
                title: 'VIP Platina',
                description: `
                    <h4 style="margin-bottom: 10px;">=== RECEBE NO ATO DA DOAÇÃO ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 19.500 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>$ 1.950.000</li>
                        <li>Carro VIP Classe A</li>
                        <li>+6 vaga na garagem</li>
                        <li>Limpa todos as multas acumuladas</li>
                        <li>Limpa 1 ADV</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== RECEBE EM TODAS AS RENOVAÇÕES ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 19.500 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>Limpa todos as multas acumuladas</li>
                        <li>Limpa 1 ADV</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== ENQUANTO FOR VIP, VOCÊ AINDA GANHA ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Tag de VIP</li>
                        <li>1 tag personalizada</li>
                        <li>Test Drive para os novos veículos</li>
                        <li>Desconto exclusivo de 5% em qualquer outro item do site</li>
                    </ul>
                `,
                cost: 'R$ 275,00',
                discount: '41%',
                price: 'R$ 161,40',
                recurringPayment: 'R$ 68,00',
                image: '/img/vips/platina-200.png',
                active: 1,
            },
            '1005': {
                code: '1005',
                title: 'VIP Diamante',
                description: `
                    <h4 style="margin-bottom: 10px;">=== RECEBE NO ATO DA DOAÇÃO ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 28.000 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>$ 2.800.000</li>
                        <li>Carro VIP Classe A</li>
                        <li>Moto VIP</li>
                        <li>+8 vaga na garagem</li>
                        <li>Limpa todos as multas acumuladas</li>
                        <li>Limpa 2 ADV</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== RECEBE EM TODAS AS RENOVAÇÕES ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 28.000 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>Limpa todos as multas acumuladas</li>
                        <li>Limpa 2 ADV</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== ENQUANTO FOR VIP, VOCÊ AINDA GANHA ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Tag de VIP</li>
                        <li>2 tag personalizada</li>
                        <li>Test Drive para os novos veículos</li>
                        <li>Desconto exclusivo de 5% em qualquer outro item do site</li>
                    </ul>
                `,
                cost: 'R$ 472,20',
                discount: '46%',
                price: 'R$ 253,55',
                recurringPayment: 'R$ 128,00',
                image: '/img/vips/diamante-200.png',
                active: 1,
            },
            '1006': {
                code: '1006',
                title: 'VIP Obsidian',
                description: `
                    <h4 style="margin-bottom: 10px;">=== RECEBE NO ATO DA DOAÇÃO ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 45.000 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>$ 4.500.000</li>
                        <li>2 Carros VIP Classe A</li>
                        <li>2 Motos VIP</li>
                        <li>+10 vaga na garagem</li>
                        <li>Limpa todos as multas acumuladas</li>
                        <li>Remove Ban e todas ADV's</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== RECEBE EM TODAS AS RENOVAÇÕES ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Salário de $ 45.000 a cada 40 minutos jogados (válido por 30 dias)</li>
                        <li>Limpa todos as multas acumuladas</li>
                        <li>Remove Ban e todas ADV's</li>
                    </ul>

                    <h4 style="margin-bottom: 10px;">=== ENQUANTO FOR VIP, VOCÊ AINDA GANHA ===</h4>
                    <ul style="margin-bottom: 20px;">
                        <li>Tag de VIP</li>
                        <li>3 tag personalizada</li>
                        <li>Test Drive para os novos veículos</li>
                        <li>Desconto exclusivo de 5% em qualquer outro item do site</li>
                    </ul>
                `,
                cost: 'R$ 861,00',
                discount: '50%',
                price: 'R$ 422,50',
                recurringPayment: 'R$ 240,00',
                image: '/img/vips/obsidian-200.png',
                active: 1,
            },
        },
    },
    'carros-classe-b': {
        title: 'Carros Classe B',
        slug: 'carros-classe-b',
        active: 1,
        showImage: 1,
        items: {},
    },
    'carros-classe-a': {
        title: 'Carros Classe A',
        slug: 'carros-classe-a',
        active: 1,
        showImage: 1,
        items: {},
    },
    'motos': {
        title: 'Motos',
        slug: 'motos',
        active: 1,
        showImage: 1,
        items: {},
    },
    'vagas': {
        title: 'Vagas',
        slug: 'vagas',
        active: 1,
        showImage: 1,
        items: {
            '8001': {
                code: '8001',
                title: '+1 Vaga',
                description: `
                    <h3>+1 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 4 vagas)</p>
                `,
                price: 'R$ 10,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
            '8002': {
                code: '8002',
                title: '+2 Vaga',
                description: `
                    <h3>+2 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 5 vagas)</p>
                `,
                price: 'R$ 19,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
            '8003': {
                code: '8003',
                title: '+3 Vaga',
                description: `
                    <h3>+3 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 6 vagas)</p>
                `,
                price: 'R$ 27,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
            '8004': {
                code: '8004',
                title: '+4 Vaga',
                description: `
                    <h3>+4 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 7 vagas)</p>
                `,
                price: 'R$ 34,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
            '8005': {
                code: '8005',
                title: '+5 Vaga',
                description: `
                    <h3>+5 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 8 vagas)</p>
                `,
                price: 'R$ 40,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
            '8006': {
                code: '8006',
                title: '+6 Vaga',
                description: `
                    <h3>+6 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 9 vagas)</p>
                `,
                price: 'R$ 45,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
            '8007': {
                code: '8007',
                title: '+7 Vaga',
                description: `
                    <h3>+7 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 10 vagas)</p>
                `,
                price: 'R$ 49,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
            '8008': {
                code: '8008',
                title: '+8 Vaga',
                description: `
                    <h3>+8 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 11 vagas)</p>
                `,
                price: 'R$ 52,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
            '8009': {
                code: '8009',
                title: '+9 Vaga',
                description: `
                    <h3>+9 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 12 vagas)</p>
                `,
                price: 'R$ 54,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
            '8010': {
                code: '8010',
                title: '+10 Vaga',
                description: `
                    <h3>+10 Vaga</h3>

                    <p>Adicionar mais uma vaga (total 13 vagas)</p>
                `,
                price: 'R$ 55,00',
                image: `/img/vaga-400-200.jpg`,
                active: 1,
            },
        },
    },
    'dinheiro': {
        title: 'Dinheiro',
        slug: 'dinheiro',
        active: 1,
        showImage: 1,
        items: {
            '5001': {
                code: '5001',
                title: '$ 250.000 no jogo',
                description: '<h2>$ 250.000 no jogo</h2>',
                price: 'R$ 10,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '5002': {
                code: '5002',
                title: '$ 500.000 no jogo',
                description: '<h2>$ 500.000 no jogo</h2>',
                price: 'R$ 18,50',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '5003': {
                code: '5003',
                title: '$ 750.000 no jogo',
                description: '<h2>$ 750.000 no jogo</h2>',
                price: 'R$ 25,50',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '5004': {
                code: '5004',
                title: '$ 1.000.000 no jogo',
                description: '<h2>$ 1.000.000 no jogo</h2>',
                price: 'R$ 31,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '5005': {
                code: '5005',
                title: '$ 2.000.000 no jogo',
                description: '<h2>$ 2.000.000 no jogo</h2>',
                price: 'R$ 56,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '5006': {
                code: '5006',
                title: '$ 4.000.000 no jogo',
                description: '<h2>$ 4.000.000 no jogo</h2>',
                price: 'R$ 100,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
        },
    },
    'salario': {
        title: 'Salário',
        slug: 'salário',
        active: 1,
        showImage: 1,
        items: {
            '6001': {
                code: '6001',
                title: '$ 2.500 de salário',
                description: '<h2>$ 2.500 de salário no jogo</h2>',
                price: 'R$ 10,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '6002': {
                code: '6002',
                title: '$ 5.000 de salário',
                description: '<h2>$ 5.000 de salário no jogo</h2>',
                price: 'R$ 20,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '6003': {
                code: '6003',
                title: '$ 7.500 de salário',
                description: '<h2>$ 7.500 de salário no jogo</h2>',
                price: 'R$ 38,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '6004': {
                code: '6004',
                title: '$ 10.000 de salário',
                description: '<h2>$ 10.000 de salário no jogo</h2>',
                price: 'R$ 54,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '6005': {
                code: '6005',
                title: '$ 20.000 de salário',
                description: '<h2>$ 20.000 de salário no jogo</h2>',
                price: 'R$ 128,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
            '6006': {
                code: '6006',
                title: '$ 40.000 de salário',
                description: '<h2>$ 40.000 de salário no jogo</h2>',
                price: 'R$ 240,00',
                image: '/img/dinheiro/money.png',
                active: 1,
            },
        },
    },
};

const carsClassB = {

    '1': {
        name: 'MB G 65',
        velocidade: 3,
        estabilidade: 4,
        prestigio: 2,
        resistencia: 3,
    },

    '2': {
        name: 'MB SL 65',
        velocidade: 3,
        estabilidade: 3,
        prestigio: 3,
        resistencia: 4,
    },

    '3': {
        name: 'MUSTANG RTR',
        velocidade: 4,
        estabilidade: 1,
        prestigio: 4,
        resistencia: 4,
    },

    '4': {
        name: 'NISSAN SKYLINE R34',
        velocidade: 4,
        estabilidade: 4,
        prestigio: 3,
        resistencia: 3,
    },

    '5': {
        name: 'AUDI Q820',
        velocidade: 2,
        estabilidade: 3,
        prestigio: 2,
        resistencia: 4,
    },

    '6': {
        name: 'TOYOTA CHR',
        velocidade: 2,
        estabilidade: 3,
        prestigio: 2,
        resistencia: 4,
    },

    '7': {
        name: 'TOYOTA SUPRA',
        velocidade: 4,
        estabilidade: 3,
        prestigio: 3,
        resistencia: 3,
    },

    '8': {
        name: 'AUDI RS6',
        velocidade: 4,
        estabilidade: 4,
        prestigio: 3,
        resistencia: 4,
    },

    '9': {
        name: 'DODGE CHARGER SRT',
        velocidade: 4,
        estabilidade: 4,
        prestigio: 4,
        resistencia: 3,
    },

    // '10': {
    //     name: 'EVOQUE',
    //     velocidade: 2,
    //     estabilidade: 2,
    //     prestigio: 3,
    //     resistencia: 3,
    // },

};

const carsClassA = {

    '1': {
        name: 'MB AMG C63',
        velocidade: 4,
        estabilidade: 4,
        prestigio: 5,
        resistencia: 4,
    },

    '2': {
        name: 'NISSAN 370Z',
        velocidade: 5,
        estabilidade: 4,
        prestigio: 4,
        resistencia: 3,
    },

    '3': {
        name: 'NISSAN GTR',
        velocidade: 4,
        estabilidade: 4,
        prestigio: 5,
        resistencia: 3,
    },

    '4': {
        name: 'NISSAN GTR NISMO',
        velocidade: 5,
        estabilidade: 4,
        prestigio: 5,
        resistencia: 4,
    },

    '5': {
        name: 'PAGANI HUAYRA',
        velocidade: 5,
        estabilidade: 4,
        prestigio: 5,
        resistencia: 3,
    },

    '6': {
        name: 'TESLA PRIOR',
        velocidade: 3,
        estabilidade: 5,
        prestigio: 4,
        resistencia: 4,
        combustivel: 5,
    },

    '7': {
        name: 'BMW M3 F80',
        velocidade: 4,
        estabilidade: 5,
        prestigio: 5,
        resistencia: 4,
    },

    '8': {
        name: 'BMW M4 GTS',
        velocidade: 4,
        estabilidade: 5,
        prestigio: 5,
        resistencia: 4,
    },

    '9': {
        name: 'BMW I8',
        velocidade: 5,
        estabilidade: 5,
        prestigio: 5,
        resistencia: 4,
    },

    '10': {
        name: 'FERRARI 458 ITÁLIA',
        velocidade: 5,
        estabilidade: 4,
        prestigio: 5,
        resistencia: 4,
    },

    '11': {
        name: 'FORD MUSTANG',
        velocidade: 4,
        estabilidade: 4,
        prestigio: 5,
        resistencia: 3,
    },

};

const motos = {

    '1': {
        name: 'Yamaha MT-07',
        velocidade: 3,
        torque: 3,
        prestigio: 2,
        resistencia: 3,
    },

    '2': {
        name: 'Yamaha R1',
        velocidade: 4,
        torque: 4,
        prestigio: 4,
        resistencia: 3,
    },

    '3': {
        name: 'Yamaha Zinger R1',
        velocidade: 5,
        torque: 4,
        prestigio: 4,
        resistencia: 4,
    },

    '4': {
        name: 'Zx 10R',
        velocidade: 4,
        torque: 4,
        prestigio: 5,
        resistencia: 3,
    },

    '5': {
        name: 'CB500x',
        velocidade: 4,
        torque: 4,
        prestigio: 4,
        resistencia: 4,
    },

    '6': {
        name: 'CB500F',
        velocidade: 4,
        torque: 3,
        prestigio: 4,
        resistencia: 4,
    },

    '7': {
        name: 'BMW R1250',
        velocidade: 5,
        torque: 5,
        prestigio: 6,
        resistencia: 4,
    },

};

let id = 4000;
for (let i = 1; i <= 9; i++) {
    id += i;
    categories['carros-classe-b'].items[id] = {
        code: id,
        title: carsClassB[i].name,// `Carro ${id}`,
        description: `
            <h3>${carsClassB[i].name}</h3>

            <ul>
                <li>
                    ${generateStars(carsClassB[i].velocidade)}
                    Velocidade
                </li>
                <li>
                    ${generateStars(carsClassB[i].estabilidade)}
                    Estabilidade
                </li>
                <li>
                    ${generateStars(carsClassB[i].prestigio)}
                    Prestígio
                </li>
                <li>
                    ${generateStars(carsClassB[i].resistencia)}
                    Resistência
                </li>
            </ul>
        `,
        price: 'R$ 50,00',
        image: `/img/veiculos/vip1/vip1-${i}-400-200.jpg`,
        active: 1,
    };
}

for (let i = 1; i <= 11; i++) {
    id += i;

    const combustivel = carsClassA[i].combustivel ? `
        <li>
            ${generateStars(carsClassA[i].combustivel)}
            Combustível
        </li>
    ` : '';

    categories['carros-classe-a'].items[id] = {
        code: id,
        title: carsClassA[i].name,// `Carro ${id}`,
        description: `
            <h3>${carsClassA[i].name}</h3>

            <ul>
                <li>
                    ${generateStars(carsClassA[i].velocidade)}
                    Velocidade
                </li>
                <li>
                    ${generateStars(carsClassA[i].estabilidade)}
                    Estabilidade
                </li>
                <li>
                    ${generateStars(carsClassA[i].prestigio)}
                    Prestígio
                </li>
                <li>
                    ${generateStars(carsClassA[i].resistencia)}
                    Resistência
                </li>
                ${combustivel}
            </ul>
        `,
        price: 'R$ 75,00',
        image: `/img/veiculos/vip2/vip2-${i}-400-200.jpg`,
        active: 1,
    };
}

for (let i = 1; i <= 7; i++) {
    id += i;

    categories['motos'].items[id] = {
        code: id,
        title: motos[i].name,// `Carro ${id}`,
        description: `
            <h3>${motos[i].name}</h3>

            <ul>
                <li>
                    ${generateStars(motos[i].velocidade, i == 7 ? 6 : 5)}
                    Velocidade
                </li>
                <li>
                    ${generateStars(motos[i].torque, i == 7 ? 6 : 5)}
                    Torque
                </li>
                <li>
                    ${generateStars(motos[i].prestigio, i == 7 ? 6 : 5)}
                    Prestígio
                </li>
                <li>
                    ${generateStars(motos[i].resistencia, i == 7 ? 6 : 5)}
                    Resistência
                </li>
            </ul>
        `,
        price: 'R$ 40,00',
        image: `/img/veiculos/motos/moto-${i}-400-200.jpg`,
        active: 1,
    };
}

const categoriesArray = [];
for (let categorySlug in categories) {
    const category = categories[categorySlug];
    const items = category.items;
    const itemsArray = [];

    for (let itemCode in items) {
        const item = items[itemCode];
        item.categorySlug = categorySlug;
        itemsArray.push(item);
    }

    category.slug = categorySlug;
    category.items = itemsArray;

    categoriesArray.push(category);
}

module.exports = {
    categories: categoriesArray,
};
