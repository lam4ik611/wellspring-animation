import {gsap, TweenMax, TweenLite, TimelineMax} from './gsap';
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

        this.scroller = {
            ease: 0.0005, // <= scroll speed
            endX: 0,
            x: 0,
            resizeRequest: 1,
            scrollRequest: 0,
        };

        this.init();
    }

    init() {
        TweenLite.set('body', {
            height: this.scrollHeight,
            overflowY: 'scroll',
            //rotation: 0.01,
            //force3D: true
        });

        window.addEventListener('load', () => {
            this.update();
            window.focus();
            window.addEventListener('resize', () => this.onResize());
            document.addEventListener('scroll', () => this.onScroll());
        });
        //document.addEventListener('scroll', () => requestAnimationFrame(() => this.update()));
    }

    onResize() {
        this.scroller.resizeRequest++;
        if (!this.requestId) {
            this.requestId = requestAnimationFrame(() => this.update());
        }
    }

    onScroll() {
        this.scroller.scrollRequest++;
        if (!this.requestId) {
            this.requestId = requestAnimationFrame(() => this.update());
        }
    }

    update() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const resized = this.scroller.resizeRequest > 0;

        if (resized) {
            /*document.body.style.height = `${this.scrollHeight}px`;
            this.scroller.resizeRequest = 0;*/
        }

        this.scroller.endX = scrollY;
        this.scroller.x += (scrollY - this.scroller.x) * this.scroller.ease;

        if (Math.abs(scrollY - this.scroller.x) < 0.05 || resized) {
            this.scroller.x = scrollY;
            this.scroller.scrollRequest = 0;
        }

        this.elements.forEach(item => {
            const itemSpeed = item.dataset.speed;
            const elementSpeed = `${Math.floor(-itemSpeed * this.scroller.x) * .05}%`;
            if (item.dataset.name === 'ground') console.log(elementSpeed)

            TweenLite.to(item, 0.5, {
                x: elementSpeed,
                z: 0.01
            })
        });

        this.requestId = this.scroller.scrollRequest > 0 ? requestAnimationFrame(this.update) : null;
        /* this.elements.forEach(item => {
            const itemSpeed = item.dataset.speed;

            TweenMax.set(item, {
                x: -itemSpeed * currentScrollPosition * .5
            })
        });*/
    }
}

export default Animation;




