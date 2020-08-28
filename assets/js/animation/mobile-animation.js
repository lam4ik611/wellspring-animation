import {gsap, TweenLite} from './gsap';
import ScrollTrigger from './gsap/ScrollTrigger';
import ScrollToPlugin from './gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

class MobileAnimation {
    constructor() {
        this.mobileContainer = document.querySelector('[data-el="animated.mobile-container"]');

        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            this.setBodyScroll();
        });
    }

    setBodyScroll() {
        TweenLite.set('body', {
            height: this.mobileContainer.offsetHeight,
            overflowY: 'scroll',
        });
    }
}

export default MobileAnimation;
