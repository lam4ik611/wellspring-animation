import {gsap, TweenLite} from './gsap';
import ScrollTrigger from './gsap/ScrollTrigger';
import ScrollToPlugin from './gsap/ScrollToPlugin';
import Swiper from 'swiper';

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

            this.setBodyScroll();
            this.parallax();
            this.checkWindowSize();
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
        this.mobileSections.forEach((section, index) => {
            ScrollTrigger.create({
                trigger: section,
                start: `top center`,
                end: 'bottom center',
                toggleClass: 'visible',
                once: true,
            });
        });

        ScrollTrigger.create({
            trigger: this.mobileHouse,
            start: `top center`,
            end: 'bottom center',
            toggleClass: 'visible',
            once: true
        });
    }
}

export default MobileAnimation;
