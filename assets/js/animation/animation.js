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
        this.houseContent = document.querySelector('[data-el="animated.house-content"]');
        this.beginButton = document.querySelector('[data-el="animated.begin-button"]');

        this.viewportHeight = window.innerHeight;
        this.isScrolling = null;
        this.isElementsStopped = false;

        this.elementsTimeline = null;
        this.personsTimeline = null;

        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            window.onbeforeunload = () => {
                window.scrollTo(0, 0);
            }

            this.setBodyScroll();
            this.scrollTrigger();

            this.beginButton.addEventListener('click', () => {
                window.location.reload();
            })
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
        this.personsTimeline = gsap.to(this.persons, {
            x: () => window.innerWidth / 8,
            scrollTrigger: {
                trigger: this.walkingContainer,
                start: `+=${window.innerWidth / 3} top`,
                end: () => `${window.innerWidth} bottom`,
                scrub: 1,
            },
        });

        // parallax elements
        this.elementsTimeline = gsap.to(this.elements, {
            x: (index, target) => {
                return -window.innerWidth * target.dataset.speed * (this.elements.length + 2);
            },
            scrollTrigger: {
                trigger: this.container,
                scrub: true,
                start: 'top top',
                end: () => `+=${this.container.offsetWidth}`,
                onUpdate: (self) => {
                    if (this.isElementsStopped) {
                        return;
                    }

                    if (self.progress >= .8) {
                        this.houseMethod();
                        return;
                    }

                    gsap.to(this.house, {
                        x: (index, target) => {
                            console.log(target)
                            return 0;
                        },
                        scrollTrigger: {
                            trigger: this.container,
                            toggleActions: 'restart none none none',
                            start: `${window.innerWidth * 13.5} top`,
                            //end: `bottom 100%+=${window.innerWidth * 10}`,
                            scrub: true,
                        },
                        onComplete: () => {
                            console.log('completed')
                        }
                    });

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
                    startPosition = window.innerWidth * 1.5;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
                case 2:
                    startPosition = window.innerWidth * 2.8;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
                case 3:
                    startPosition = window.innerWidth * 4.5;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
                case 4:
                    startPosition = window.innerWidth * 6.5;
                    endPosition = startPosition + window.innerWidth * 2.5;
                    break;
                case 5:
                    startPosition = window.innerWidth * 8.5;
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

                    console.log(self);
                    //this.houseMethod();
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
        const exceptStars = Array.prototype.slice.call(this.elements).filter(value => value.dataset.name !== 'stars');
        const stars = Array.prototype.slice.call(this.elements).filter(value => value.dataset.name === 'stars');
        const cyclist = Array.prototype.slice.call(this.persons).filter(value => value.dataset.name === 'cyclist');

        //gsap.set(this.house, {x: 0});

        //this.elementsTimeline.pause(this.elements);
        this.isElementsStopped = true;

        gsap.to(this.houseContent, {
            scrollTrigger: {
                trigger: this.house,
                start: `top center`,
                end: `+=${this.container.offsetWidth} bottom`,
                scrub: true,
                onEnter: () => {
                    TweenLite.to('body', {
                        overflowY: 'hidden',
                    });

                    gsap.to(cyclist, {
                        x: () => window.innerWidth * .65,
                        duration: 2,
                        scrollTrigger: {
                            trigger: this.walkingContainer,
                            start: `top top`,
                            end: `top top`,
                            onLeave: () => {

                            },
                        },
                        onComplete: () => {
                            TweenLite.set('body', {
                                height: +this.container.offsetWidth + (this.houseContent.offsetHeight * 6),
                                overflowY: 'scroll',
                            });

                            gsap.to(cyclist, {scaleX: -1, duration: .1, ease: 'power2.out'});
                        },
                    });
                },
                onUpdate: self => {
                    console.log(self.progress);

                    gsap.to(stars, {y: -(self.progress * 50)})
                    gsap.to(exceptStars, {y: (self.progress * 2000)});
                    gsap.to(this.persons, {y: (self.progress * 2000)});
                    gsap.to(this.houseContent, {y: (self.progress * 2500)});

                    if (self.progress >= .55) {
                        this.houseContent.classList.add('active');

                        setTimeout(() => {
                            TweenLite.to('body', {
                                overflowY: 'hidden',
                            });

                            this.beginButton.classList.add('active');
                        }, 1000);
                    } else {
                        this.houseContent.classList.remove('active');
                    }
                },
                onLeaveBack: self => {
                    this.setBodyScroll();
                    this.isElementsStopped = false;
                    console.log('LEAVE!!!', self)
                    //this.elementsTimeline.play(this.elements, false);
                    //gsap.set(this.house, {x: '100%'});

                    gsap.to(cyclist, {
                        x: () => 200,
                        duration: 2,
                        scrollTrigger: {
                            trigger: this.walkingContainer,
                            start: `top top`,
                            end: `top top`,
                        },
                    });
                }
                //snap: 1 / (sections.length - 1),
            }
        });
    }
}

export default Animation;




