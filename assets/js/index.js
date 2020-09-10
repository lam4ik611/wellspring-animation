import '../scss/index.scss';
import Swiper from "swiper";

import './animation';
import './preloader';
import './is-support-webp';

let swiper = new Swiper('#mySwiper', {
    direction: 'vertical',
    on: {
        init: function () {
            console.log('swiper initialized');
        },
    },
});

swiper.on('slideChange', function () {
    console.log('slide changed');
});

setTimeout(() => {
    swiper.update();
}, 1000);
