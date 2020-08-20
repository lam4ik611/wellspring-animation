import {gsap, TweenMax, TweenLite, TimelineMax} from './gsap';
import ScrollTrigger from './gsap/ScrollTrigger';
import ScrollToPlugin from './gsap/ScrollToPlugin';
import Draggable from './gsap/Draggable';

import getScrollSpeed from '../util/scrollSpeed';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(TweenMax);
gsap.registerPlugin(TimelineMax);

class Animation {
    constructor() {
        this.animatedWalkingContainer = '[data-el="animated.container"]';
        this.animatedContainer = '[data-el="animated.container"]';
        this.animatedElement = '[data-el="animated.element"]';
        this.animatedPerson = '[data-el="animated.person"]';
        this.viewportHeight = window.innerHeight;

        this.elements = document.querySelectorAll(this.animatedElement);
        this.person = document.querySelector(this.animatedPerson);
        this.wrapper = document.querySelector('[data-el="animated.wrapper"]');
        this.sections = document.querySelectorAll('[data-el="animated.section"]');
        this.preview = document.querySelectorAll('[data-el="animated.preview"]');

        this.isScrolling = null;
        this.container = document.querySelector(this.animatedContainer);

        this.scroller = {
            x: 0,
            resizeRequest: 1,
            scrollRequest: 0,
        };
        this.init();
    }

    init() {
        TweenLite.set('body', {
            height: this.container.offsetWidth,
            overflowY: 'scroll',
            //rotation: 0.01,
            //force3D: true
        });

        window.addEventListener('load', () => {
            //this.update();
            window.focus();
            //this.walking();
            this.scrollTrigger();
            document.addEventListener('scroll', () => this.onScroll());
        });
    }

    onScroll() {
        this.scroller.scrollRequest++;
        if (!this.requestId) {
            this.requestId = requestAnimationFrame(() => this.parallax());
        }
    }

    scrollTrigger() {
        const sectionContainer = document.querySelector('[data-section]');
        const globalContext = this;

        this.sections.forEach((value, index) => {
            ScrollTrigger.create({
                trigger: value,
                toggleActions: 'play pause reverse pause',
                toggleClass: 'visible',
                start: `${index * value.offsetWidth} center`,
                end: `${(index + 1) * value.offsetWidth} center`,
                scrub: true,
                onEnter: self => {
                    if (!self.isActive || self.trigger === this.sections[0]) {
                        return;
                    }

                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

                    window.onscroll = () => window.scrollTo(scrollLeft, scrollTop);
                    this.walking(false);

                    setTimeout(() => {
                        window.onscroll = () => {};
                        this.walking(true);
                    }, 3000);
                },
                //pinSpacing: false
            });
        });

        gsap.to(this.preview, {
            scrollTrigger: {
                trigger: this.preview,
                start: `${window.innerWidth / 2} center`,
                end: `${window.innerWidth * 2} enter`,
                toggleActions: 'play pause play reverse',
            },
            y: function (index, target, targets) {
                return -target.offsetHeight - 20;
            },
            duration: 2,
        });
    }

    walking(state) {
        const spriteSheet = {
            frames: 5,
            defaultFrame: 7,
            duration: 1,
        };

        const personTimeline = new TimelineMax();

        for (let i = 0; i <= spriteSheet.frames; i++) {
            personTimeline
                .set(this.person, {
                    ...i === spriteSheet.frames ? {
                        onComplete: () => this.walking(true),
                    } : {},
                    attr: {
                        ['data-step']: i,
                    },
                }, i / spriteSheet.frames * spriteSheet.duration)
        }

        if (!state) {
            TweenMax.killTweensOf(this.person);
            setTimeout(() => {
                this.person.dataset.step = spriteSheet.defaultFrame;
            }, 200);
        }
    }

    parallax() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const resized = this.scroller.resizeRequest > 0;

        this.scroller.x = scrollY;

        if (Math.abs(scrollY - this.scroller.x) < 0.05 || resized) {
            this.scroller.scrollRequest = 0;
        }

        gsap.to(this.elements, {
            x: (index, target) => {
                return -this.scroller.x * target.dataset.speed;
            },
            force3D: true,
        });

        this.requestId = this.scroller.scrollRequest > 0 ? requestAnimationFrame(this.parallax) : null;

        // detect started/stopped scroll
        if (this.isScrolling === null) {
            this.walking(true);
        } else {
            clearTimeout(this.isScrolling);
        }

        this.isScrolling = setTimeout(() => {
            this.walking(false);
            this.isScrolling = null;
        }, 500);
    }
}

export default Animation;




