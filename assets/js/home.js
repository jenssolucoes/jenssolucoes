/*================================  */
/*================================  */
/* ====== HOME PAGE SCRIPT ======== */
/*================================  */
/*================================ */

class HomePage {
    constructor() {
        this.init();
    }

    init() {
        // Inicializa o Swiper para os depoimentos
        if (typeof Swiper !== 'undefined') {
            new Swiper('.reviews-swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    }
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
