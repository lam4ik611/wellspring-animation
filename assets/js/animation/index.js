import Animation from './animation';
import MobileAnimation from './mobile-animation';
import Swiper from 'swiper';

if (window.innerWidth > 1024) { // TODO
    new Animation();
} else {
    new MobileAnimation();

    new Swiper('[data-el="animated.mobile-container"]', {
        direction: 'vertical',
        autoplay: 1000,
        slidesPerView: 'auto',
        speed: 200,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
}
