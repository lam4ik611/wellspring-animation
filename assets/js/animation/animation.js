import {gsap, TweenLite, Linear, TimelineMax} from './gsap';
import ScrollTrigger from './gsap/ScrollTrigger';
import ScrollToPlugin from './gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

class Animation {
    constructor() {
        this.container = document.querySelector('[data-el="animated.container"]');
        this.elements = isChrome ? document.querySelectorAll('[data-el="animated.element"]')
            : document.querySelectorAll('[data-el="animated.element"], [data-el="animated.stars"]');
        this.ground = document.querySelector('[data-el="animated.ground"]');
        this.persons = document.querySelectorAll('[data-el="animated.person"]');
        this.wrapper = document.getElementById('wrapper');
        this.sections = document.querySelectorAll('[data-el="animated.section"]');
        this.preview = document.querySelectorAll('[data-el="animated.preview"]');
        this.walkingContainer = document.querySelector('[data-el="animated.walking-container"]');

        this.scrollUpButton = document.querySelector('[data-el="animated.scroll-up-button"]');
        this.finishedElement = document.querySelector('[data-el="animated.finished"]');

        this.viewportHeight = window.innerHeight;
        this.isScrolling = null;
        this.isElementsStopped = false;

        this.elementsTimeline = null;
        this.personsTimeline = null;
        this.houseTimeline = null;

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
        const parallaxElements = Array.prototype.slice.call(this.elements).filter(value => value.dataset.name !== 'ground');

        const walkingSheet = {
            frames: 5,
            defaultFrame: 7,
            duration: 1,
        };

        let counter = 1;
        let walkingInterval;

        let tlParallax = new TimelineMax();
        // appear of persons
        gsap.set(this.persons, {x: window.innerWidth});
        this.personsTimeline = gsap.to(this.persons, {
            x: () => window.innerWidth / 8,
            duration: .5,
            force3D: false,
            scrollTrigger: {
                trigger: this.walkingContainer,
                start: `+=${window.innerWidth / 3} top`,
                end: () => `${window.innerWidth} bottom`,
                scrub: 1,
            },
        });

        // parallax elements
        this.elementsTimeline = tlParallax.to(parallaxElements, {

            ease: Linear.none,
            force3D: false,
            scrollTrigger: {
                trigger: this.container,
                scrub: true,
                start: 'top top',
                end: () => `+=${this.container.offsetWidth - (document.body.scrollWidth * 1.25)}`,
                onEnterBack: () => this.resetUpMethod(),
                onLeave: () => {
                    TweenLite.to('body', {
                        overflowY: 'hidden',
                    });

                    setTimeout(() => {
                        this.houseMethod();
                    }, 250);
                },
                onUpdate: (self) => {
                    console.log(self.trigger)
                    //let houseSpeed = self.progress * (scrollHeight * 1.25);
                    gsap.to(parallaxElements, {x: -(self.progress * this.container.offsetHeight * 14.8)})
                    if (this.isElementsStopped) {
                        return;
                    }

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
                            gsap.set(this.persons, {classList: 'animation-person'})
                            gsap.to(this.persons, {scaleX: 1, duration: .1, ease: 'power2.out'});
                        } else if (velocity < -1) {
                            gsap.set(this.persons, {classList: 'animation-person flip'})
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
            let startPosition, endPosition, countNumber = 1.95;

            switch (index) {
                case 0:
                    startPosition = value.getBoundingClientRect().left * 3;
                    endPosition = startPosition + window.innerWidth;
                    break;
                case 1:
                    startPosition = value.getBoundingClientRect().left * countNumber;
                    endPosition = startPosition + window.innerWidth * 2;
                    break;
                case 2:
                    startPosition = value.getBoundingClientRect().left * countNumber;
                    endPosition = startPosition + window.innerWidth * 2;
                    break;
                case 3:
                    startPosition = value.getBoundingClientRect().left * countNumber;
                    endPosition = startPosition + window.innerWidth * 2;
                    break;
                case 4:
                    startPosition = value.getBoundingClientRect().left * countNumber;
                    endPosition = startPosition + window.innerWidth * 2;
                    break;
                case 5:
                    startPosition = value.getBoundingClientRect().left * countNumber;
                    endPosition = startPosition + window.innerWidth * 2;
                    break;
                case 6:
                    startPosition = value.getBoundingClientRect().left * countNumber;
                    endPosition = startPosition + window.innerWidth * 2;
                    break;
            }

            ScrollTrigger.create({
                trigger: value,
                toggleActions: 'play pause reverse pause',
                toggleClass: 'visible',
                start: `${startPosition} center`,
                end: `${endPosition} center`,
                scrub: true,
                force3D: false,
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
                    }, 1500);
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
        const stars = !isChrome && Array.prototype.slice.call(this.elements).find(value => value.dataset.name === 'stars');
        const houseElement = Array.prototype.slice.call(this.elements).find(value => value.dataset.name === 'house');
        const exceptStars = Array.prototype.slice.call(this.elements).filter(value => value.dataset.name !== 'stars' && value.dataset.name !== 'house');
        const cyclist = Array.prototype.slice.call(this.persons).filter(value => value.dataset.name === 'cyclist');
        const newParallaxElements = Array.prototype.concat.call(exceptStars, this.ground);
        const scrollHeight = houseElement.offsetHeight * (window.innerWidth / houseElement.offsetHeight) + 100;

        this.isElementsStopped = true;

        this.scrollUpButton.classList.add('active');

        gsap.to(cyclist, {
            x: () => window.innerWidth * .6,
            duration: 1.5,
            ease: 'power2.out',
            force3D: false,
            scrollTrigger: {
                trigger: this.walkingContainer,
                start: `top top`,
                end: `top bottom`,
            },
            onComplete: () => {
                TweenLite.set('body', {
                    height: +this.container.offsetWidth + scrollHeight,
                    overflowY: 'scroll',
                });

                gsap.to(cyclist, {scaleX: -1, duration: .1, ease: 'power2.out'});
            },
        });

        gsap.to(houseElement, {
            scrollTrigger: {
                trigger: this.container,
                start: `${window.innerWidth / 2} bottom`,
                end: `${scrollHeight} top`,
                scrub: true,
                force3D: false,
                onUpdate: self => {
                    let houseSpeed = self.progress * (scrollHeight * 1.25);

                    if (!isChrome) gsap.to(stars, {y: (self.progress.toFixed(3) * 200)});
                    gsap.to(newParallaxElements, {y: houseSpeed});
                    gsap.to(this.persons, {y: houseSpeed});
                    gsap.to(houseElement, {y: houseSpeed});

                    /*if (self.progress >= .15) {
                        this.scrollUpButton.classList.remove('active');
                    } else {
                        this.scrollUpButton.classList.add('active');
                    }*/

                    if (self.progress >= .9) {
                        this.finishedElement.classList.add('active');
                    } else {
                        this.finishedElement.classList.remove('active');
                    }
                },
                onLeaveBack: self => {
                    this.setBodyScroll();
                    self.kill();

                    this.resetUpMethod();
                },
            }
        });
    }

    resetUpMethod() {
        const cyclist = Array.prototype.slice.call(this.persons).filter(value => value.dataset.name === 'cyclist');

        this.setBodyScroll();
        this.isElementsStopped = false;

        gsap.to(cyclist, {
            x: () => 200,
            duration: 1.5,
            scrollTrigger: {
                trigger: this.walkingContainer,
                start: `top top`,
                end: `top top`,
                onEnter: () => this.scrollUpButton.classList.remove('active'),
            },
        });
    }
}

export default Animation;




