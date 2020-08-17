import {gsap, TweenMax, TweenLite, TimelineMax} from './gsap';
import ScrollTrigger from './gsap/ScrollTrigger';
import ScrollToPlugin from './gsap/ScrollToPlugin';
import Draggable from './gsap/Draggable';

import getScrollSpeed from '../util/scrollSpeed';

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
        this.isScrolling = null;
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
            //this.update();
            window.focus();
            //this.walking();
            window.addEventListener('resize', () => this.onResize());
            document.addEventListener('scroll', () => this.onScroll());
        });
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

    walking(state) {
        const spriteSheet = {
            total: 6,
            duration: 1,
        };

        const personTimeline = new TimelineMax();
        for (let i = 0; i <= spriteSheet.total; i++) {
            personTimeline
                .set(this.person, {
                    onCompleted: i === spriteSheet.total ? () => this.walking(true) : {},
                    attr: {
                        ['data-step']: i,
                    }
                }, i / spriteSheet.total * spriteSheet.duration)
        }

        if (!state) {
            TweenMax.killTweensOf(this.person);
            setTimeout(() => {
                this.person.dataset.step = 7;
            }, 200);
        }
    }

    update() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const resized = this.scroller.resizeRequest > 0;

        this.scroller.endX = scrollY;
        this.scroller.x += (scrollY - this.scroller.x) * this.scroller.ease;

        if (Math.abs(scrollY - this.scroller.x) < 0.05 || resized) {
            this.scroller.x = scrollY;
            this.scroller.scrollRequest = 0;
        }

        gsap.to(this.elements, {
            scrollTrigger: this.elements,
            x: (index, target) => {
                return -(this.scroller.x / 2) * target.dataset.speed;
            },
            force3D: true,
        });

        this.requestId = this.scroller.scrollRequest > 0 ? requestAnimationFrame(this.update) : null;

        // detect started/stopped scroll
        if (this.isScrolling === null) {
            this.walking(true);
        } else {
            clearTimeout(this.isScrolling);
        }

        this.isScrolling = setTimeout(() => {
            console.log( 'Scrolling has stopped.' );
            this.walking(false);
            this.isScrolling = null;
        }, 500);
    }
}

export default Animation;




