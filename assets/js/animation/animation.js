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
        this.container = document.querySelector('[data-el="animated.container"]');
        this.elements = document.querySelectorAll('[data-el="animated.element"]');
        this.persons = document.querySelectorAll('[data-el="animated.person"]');
        this.wrapper = document.getElementById('wrapper');
        this.sections = document.querySelectorAll('[data-el="animated.section"]');
        this.preview = document.querySelectorAll('[data-el="animated.preview"]');
        this.walkingContainer = document.querySelector('[data-el="animated.walking-container"]');
        this.house = document.querySelector('[data-el="animated.house"]');

        this.viewportHeight = window.innerHeight;
        this.isScrolling = null;
        this.stopScroll = false;

        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            window.onbeforeunload = () => {
                window.scrollTo(0, 0);
            }

            this.setBodyScroll();
            this.scrollTrigger();
        });
    }

    setBodyScroll() {
        TweenLite.set('body', {
            height: +this.container.offsetWidth,
            overflowY: 'scroll',
        });
    }

    scrollTrigger() {
        this.parallaxMethod();
        this.sectionsMethod();
        this.previewMethod();
        //this.houseMethod();
    }

    parallaxMethod() {
        const walkingSheet = {
            frames: 5,
            defaultFrame: 7,
            duration: 1,
        };

        let counter = 1;
        let walkingInterval;

        // appear of persons
        gsap.set(this.persons, {x: window.innerWidth});
        gsap.to(this.persons, {
            x: () => window.innerWidth / 8,
            scrollTrigger: {
                trigger: this.walkingContainer,
                start: `+=${window.innerWidth / 3} top`,
                end: () => `${window.innerWidth} bottom`,
                scrub: 1,
            },
        });

        // parallax elements
        gsap.to(this.elements, {
            x: (index, target) => {
                return -window.innerWidth * target.dataset.speed * (this.elements.length + 2);
            },
            scrollTrigger: {
                trigger: this.container,
                scrub: true,
                start: 'top top',
                end: () => `+=${this.container.offsetWidth}`,
                onUpdate: (self) => {
                    const velocity = self.getVelocity();

                    if (this.isScrolling === null) {
                        // setting walking animation
                        this.persons.forEach(person => person.dataset.step = counter);
                        walkingInterval = setInterval(() => {
                            counter++;
                            this.persons.forEach(person => person.dataset.step = counter);

                            if (counter >= walkingSheet.frames) {
                                counter = 0;
                            }
                        }, 170);
                    } else {
                        clearTimeout(this.isScrolling);
                    }

                    // flip persons
                    setTimeout(() => {
                        if (velocity > 1) {
                            gsap.to(this.persons, {scaleX: 1, duration: .1, ease: 'power2.out'});
                        } else if (velocity < -1) {
                            gsap.to(this.persons, {scaleX: -1, duration: .1, ease: 'power2.out'});
                        }
                    }, 300);

                    this.isScrolling = setTimeout(() => {
                        // clearing walking animation
                        clearInterval(walkingInterval);
                        this.persons.forEach(person => person.dataset.step = walkingSheet.defaultFrame);
                        this.isScrolling = null;
                    }, 500);
                },
            },
        });
    }

    sectionsMethod() {
        // appear of lamp lights while section is visible
        this.sections.forEach((value, index) => {
            let startPosition, endPosition;

            switch (index) {
                case 0:
                    startPosition = window.innerWidth / 2;
                    endPosition = startPosition + window.innerWidth;
                    break;
                case 1:
                    startPosition = window.innerWidth * 1.2;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
                case 2:
                    startPosition = window.innerWidth * 2.3;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
                case 3:
                    startPosition = window.innerWidth * 4.3;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
                case 4:
                    startPosition = window.innerWidth * 6.3;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
                case 5:
                    startPosition = window.innerWidth * 8.3;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
                case 6:
                    startPosition = window.innerWidth * 12;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
            }

            ScrollTrigger.create({
                trigger: value,
                toggleActions: 'play pause reverse pause',
                toggleClass: 'visible',
                start: `${startPosition} center`,
                end: `${endPosition} center`,
                scrub: true,
                onEnter: self => {
                    if (!self.isActive ||
                        self.trigger === this.sections[0] ||
                        self.trigger === this.sections[this.sections.length - 1]) {
                        return;
                    }

                    TweenLite.to('body', {
                        overflowY: 'hidden',
                    });

                    setTimeout(() => {
                        this.setBodyScroll();
                    }, 2000);
                },
                onLeave: (self) => {
                    if (self.trigger !== this.sections[this.sections.length - 1]) return;

                    console.log(self)
                    this.houseMethod();
                },
            });
        });
    }

    previewMethod() {
        // preview animation
        ScrollTrigger.create({
            trigger: this.preview,
            start: `${window.innerWidth / 2} center`,
            end: `${window.innerWidth * 2} enter`,
            toggleClass: 'hidden',
            toggleActions: 'play pause play reverse',
        });
    }

    houseMethod() {
        console.log('house is init')
        /*gsap.to(this.house, {
            scrollTrigger: {
                trigger: this.container,
                start: `${this.container.offsetWidth / 2} center`
                //snap: 1 / (sections.length - 1),
            }
        });*/
    }
}

export default Animation;




