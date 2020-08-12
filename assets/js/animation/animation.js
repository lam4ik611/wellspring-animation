import {gsap, TweenMax} from './gsap';
import ScrollTrigger from './gsap/ScrollTrigger';
import ScrollToPlugin from './gsap/ScrollToPlugin';
import Draggable from './gsap/Draggable';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(TweenMax);

class Animation {
    constructor() {
        this.animatedContainer = '[data-el="animated.container"]';
        this.animatedElement = '[data-el="animated.element"]';
        this.animatedPerson = '[data-el="animated.person"]';
        this.viewportHeight = window.innerHeight;
        this.elements = document.querySelectorAll(this.animatedElement);
        this.person = document.querySelector(this.animatedPerson);
        this.scrollStep = 100;
        this.scrollHeight = document.querySelector(this.animatedContainer).offsetWidth;

        this.update();
    }

    update() {
        TweenMax.set('body', {
            height: this.scrollHeight,
            overflowY:'scroll',
        });

        document.addEventListener('scroll', () => {
            const currentScrollPosition = document.documentElement.scrollTop;

            this.elements.forEach(item => {
                const itemSpeed = item.dataset.speed;

                TweenMax
                    .from(item, {
                        x: -itemSpeed * currentScrollPosition,
                    });
            });
        });
    }
}

export default Animation;




