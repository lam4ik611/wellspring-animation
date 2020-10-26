import {gsap, TweenLite} from './gsap';
import ScrollTrigger from './gsap/ScrollTrigger';
import ScrollToPlugin from './gsap/ScrollToPlugin';
import Swiper from "swiper";
import preloader from '../preloader';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

class MobileAnimation {
    constructor() {
        this.mobileContainer = document.querySelector('[data-el="animated.mobile-container"]');
        this.mobileSections = document.querySelectorAll('[data-el="animated.mobile-section"]');
        this.mobileHouse = document.querySelectorAll('[data-el="animated.mobile-house"]');

        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            window.onbeforeunload = () => {
                window.scrollTo(0, 0);
            }

            preloader.then(success => {
                if (!success) {
                    setTimeout(() => {
                        location.reload();
                    }, 3000);

                    return;
                }

                this.parallax();
                this.checkWindowSize();
            });
        });

        window.addEventListener('resize', () => {
            this.checkWindowSize();
        });
    }

    setBodyScroll() {
        TweenLite.set('body', {
            height: this.mobileContainer.offsetHeight,
            overflowY: 'scroll',
        });
    }

    checkWindowSize() {
        if (window.innerWidth >= window.innerHeight) {
            this.mobileSections.forEach(section => section.classList.add('horizontal'));
        } else {
            this.mobileSections.forEach(section => section.classList.remove('horizontal'));
        }
    }

    parallax() {
        const prevButton = document.querySelector('[data-el="swiper.button-prev"]'),
            nextButton = document.querySelector('[data-el="swiper.button-next"]');

        let swiper = new Swiper(this.mobileContainer, {
            direction: 'horizontal',
            slidesPerView: 'auto',
            simulateTouch: true,
            speed: 200,
            navigation: {
                prevEl: '[data-el="swiper.button-prev"]',
                nextEl: '[data-el="swiper.button-next"]',
            },
        });

        prevButton.addEventListener('click', () => swiper.slidePrev());
        nextButton.addEventListener('click', () => swiper.slideNext());

        ScrollTrigger.create({
            trigger: this.mobileHouse,
            start: `top center`,
            end: 'bottom center',
            toggleClass: 'visible',
            once: true,
            onEnter: self => {
                self.trigger.scrollTop = self.trigger.offsetHeight;
            },
        });
    }
}

export default MobileAnimation;
