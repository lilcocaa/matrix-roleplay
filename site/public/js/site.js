function decodeHTMLEntities(text) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

var App = new Vue({
    el: '#AppVue',
    data: {
        categories: JSON.parse(categoriesJson),
        selectedProduct: {},
    },
    methods: {
        openDetails: function (item) {
            console.log('item', item);
            App.selectedProduct = item;

            if (item.categorySlug == 'planos-vips') {
                App.selectedProduct.html = `
                    <h2 style="margin-bottom: 40px; color: #FAAA0E; font-weight: bold; text-align: center;">🎉 Preço Promocional de Inauguração 🎉</h3>

                    ${decodeHTMLEntities(item.description)}

                    <br>

                    <p>
                        Se você quiser ter todos esses items separadamente, a doação seria <b><span class="color-logo-1 font-size-22">${item.cost}</span></b>
                    </p>

                    <br>

                    <p>
                        <b>Mas adquirindo o plano <span class="color-logo-2 font-size-22">${item.title}</span> você economiza <span class="color-logo-2 font-size-22">${item.discount}</span>,<br>doando apenas <span class="color-logo-2 font-size-22">${item.price}</span>!!!</b>
                    </p>

                    <br>

                    <p>
                        E para manter os bônus mensais, a doação cai para <b class="color-logo-2 font-size-22">${item.recurringPayment}</b>!!!
                    </p>

                    <br>

                    <p>
                        Para realizar a doação, basta ir em nosso servidor
                        do discord, no canal <a href="https://discord.com/channels/765235242600103936/775896151198269450" target="_blank">DONATES</a>
                        e mandar a seguinte mensagem:
                    </p>

                    <blockquote>
                        Olá, gostaria de fazer o meu donate para o item "${item.title}"
                    </blockquote>
                `;
            } else {
                App.selectedProduct.html = `
                    <h2 style="margin-bottom: 40px; color: #FAAA0E; font-weight: bold; text-align: center;">🎉 Preço Promocional de Inauguração 🎉</h3>

                    ${decodeHTMLEntities(item.description)}

                    <br>

                    <p>
                        Donate:  <span class="color-logo-2 font-size-22">${item.price}</span></b>
                    </p>

                    <br>

                    <p>
                        Para realizar a doação, basta ir em nosso servidor
                        do discord, no canal <a href="https://discord.com/channels/765235242600103936/775896151198269450" target="_blank">DONATES</a>
                        e mandar a seguinte mensagem:
                    </p>

                    <blockquote>
                        Olá, gostaria de fazer o meu donate para o item "${item.title}"
                    </blockquote>
                `;
            }

            $('#modalDetails').modal();
        },

        init: function () {
            setTimeout(function () {
                $('.loading').stop().animate({
                    opacity: 0,
                }, 300, function () {
                    $('.loading').remove();
                });
            }, 500);
        },
    },
});

App.init();