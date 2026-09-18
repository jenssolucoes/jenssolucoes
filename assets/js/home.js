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
        this.initReviewsSwiper();
    }

    initReviewsSwiper() {
        const el = document.querySelector('.reviews-swiper');
        if (!el || typeof Swiper === 'undefined') return;

        new Swiper(el, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            watchOverflow: true,
            speed: 900,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: el.querySelector('.swiper-pagination'),
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

document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});