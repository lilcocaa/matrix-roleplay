function decodeHTMLEntities(text) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

var App = new Vue({
    el: '#AppVue',
    data: {
        categories: JSON.parse(categoriesJson),
        selectedProduct: {
            title: `Titulo`,
            html: `Texto aqui!!!`,
        },
    },
    methods: {

        init: function () {
            setTimeout(function () {

                $('.loading').stop().animate({
                    opacity: 0,
                }, 300, function () {
                    $('.loading').remove();
                });

                $(window).on("scroll", function () {
                    // var scrollHeight = $(document).height();
                    // var scrollPosition = $(window).height() + $(window).scrollTop();
                    // console.log('scrollHeight', scrollHeight);
                    // console.log('scrollPosition', scrollPosition);
                    // if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                    //     when scroll to bottom of the page
                    // }
                });
            }, 500);
        },

        openDetails: function (item) {
            console.log('item', item);
            App.selectedProduct = item;

            if (item.categorySlug == 'planos-vips') {
                App.selectedProduct.html = `
                    <h2 class="mb-12 text-yellow-500 font-bold text-center">🎉 Preço Promocional de Inauguração 🎉</h3>

                    <div class="mb-4">
                        ${decodeHTMLEntities(item.description)}
                    </div>

                    <p class="mb-4">
                        Se você quiser ter todos esses items separadamente, a doação seria <b><span class="text-logo-400 text-xl">${item.cost}</span></b>
                    </p>

                    <p class="mb-4">
                        <b>Mas adquirindo o plano <span class="text-yellow-400 text-xl">${item.title}</span> você economiza <span class="text-yellow-400 text-xl">${item.discount}</span>, doando apenas <span class="text-yellow-400 text-xl">${item.price}</span>!!!</b>
                    </p>

                    <p class="mb-4">
                        E para manter os bônus mensais, a doação cai para <b class="text-yellow-400 text-xl">${item.recurringPayment}</b>!!!
                    </p>

                    <p class="mb-4">
                        Para realizar a doação, basta ir em nosso servidor
                        do discord, no canal <a href="https://discord.com/channels/765235242600103936/775896151198269450" target="_blank" class="text-logo-400 underline">DONATES</a>
                        e mandar a seguinte mensagem:
                    </p>

                    <blockquote class="bg-discord-600 p-4 rounded-md border-l-4 border-discord-800 font-mono">
                        Olá, gostaria de fazer o meu donate para o item "${item.title}"
                    </blockquote>
                `;
            } else {
                App.selectedProduct.html = `
                    <h2 class="mb-12 text-yellow-500 font-bold text-center">🎉 Preço Promocional de Inauguração 🎉</h3>

                    <div class="mb-4">
                        ${decodeHTMLEntities(item.description)}
                    </div>

                    <p class="mb-4">
                        Donate:  <span class="text-yellow-400 text-xl">${item.price}</span></b>
                    </p>

                    <p class="mb-4">
                        Para realizar a doação, basta ir em nosso servidor
                        do discord, no canal <a href="https://discord.com/channels/765235242600103936/775896151198269450" target="_blank" class="text-logo-400 underline">DONATES</a>
                        e mandar a seguinte mensagem:
                    </p>

                    <blockquote class="bg-discord-600 p-4 rounded-md border-l-4 border-discord-800 font-mono">
                        Olá, gostaria de fazer o meu donate para o item "${item.title}"
                    </blockquote>
                `;
            }

            App.openModal('#modalDetails');
        },

        closeDetails: function () {
            App.closeModal('#modalDetails');
        },

        openModal: function (modal) {
            $(modal)
                .removeClass('opacity-0')
                .removeClass('pointer-events-none')
                .addClass('active');
        },

        closeModal: function (modal) {
            $(modal)
                .addClass('opacity-0')
                .addClass('pointer-events-none')
                .removeClass('active');
        },

    },
});

App.init();

document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;

    if ('key' in evt) {
        isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
    } else {
        isEscape = (evt.keyCode === 27);
    }

    if (isEscape) {
        App.closeModal('.modal');
    }
};

$('.modal-overlay').off('click').on('click', function () {
    App.closeModal('.modal');
});
