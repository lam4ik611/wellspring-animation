import {gsap, TweenLite} from './gsap';
import ScrollTrigger from './gsap/ScrollTrigger';
import ScrollToPlugin from './gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

class Animation {
    constructor() {
        this.container = document.querySelector('[data-el="animated.container"]');
        this.elements = document.querySelectorAll('[data-el="animated.element"]');
        this.ground = document.querySelector('[data-el="animated.ground"]');
        this.persons = document.querySelectorAll('[data-el="animated.person"]');
        this.wrapper = document.getElementById('wrapper');
        this.sections = document.querySelectorAll('[data-el="animated.section"]');
        this.preview = document.querySelectorAll('[data-el="animated.preview"]');
        this.walkingContainer = document.querySelector('[data-el="animated.walking-container"]');
        this.house = document.querySelector('[data-el="animated.house"]');
        this.houseContent = document.querySelector('[data-el="animated.house-content"]');

        this.scrollUpButton = document.querySelector('[data-el="animated.scroll-button"]');
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

        // set position of house
        gsap.set(this.house, {x: window.innerHeight * 20});
        this.houseTimeline = gsap.to(this.house, {
            x: -window.innerWidth / 50,
            scrollTrigger: {
                trigger: this.house,
                scrub: true,
                start: 'top top',
                end: () => `+=${this.container.offsetWidth}`,
            },
        });

        // parallax elements
        this.elementsTimeline = gsap.to(parallaxElements, {
            x: (index, target) => {
                return -window.innerWidth * target.dataset.speed * 7;
            },
            scrollTrigger: {
                trigger: this.container,
                scrub: true,
                start: 'top top',
                end: () => `+=${this.container.offsetWidth - (window.innerWidth * 1.25)}`,
                onLeave: () => this.houseMethod(),
                onUpdate: (self) => {
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
            let startPosition, endPosition;

            switch (index) {
                case 0:
                    startPosition = value.getBoundingClientRect().x * 1.5;
                    endPosition = startPosition + window.innerWidth;
                    break;
                case 1:
                    startPosition = value.getBoundingClientRect().x * 1.25;
                    endPosition = startPosition + window.innerWidth * 4;
                    break;
                case 2:
                    startPosition = value.getBoundingClientRect().x * 1.45;
                    endPosition = startPosition + window.innerWidth * 4;
                    break;
                case 3:
                    startPosition = value.getBoundingClientRect().x * 1.45;
                    endPosition = startPosition + window.innerWidth * 4;
                    break;
                case 4:
                    startPosition = value.getBoundingClientRect().x * 1.5;
                    endPosition = startPosition + window.innerWidth * 4;
                    break;
                case 5:
                    startPosition = value.getBoundingClientRect().x * 1.6;
                    endPosition = startPosition + window.innerWidth * 4;
                    break;
                case 6:
                    startPosition = value.getBoundingClientRect().x * 1.7;
                    endPosition = startPosition + window.innerWidth * 4;
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
        const stars = Array.prototype.slice.call(this.elements).filter(value => value.dataset.name === 'stars');
        const exceptStars = Array.prototype.slice.call(this.elements).filter(value => value.dataset.name !== 'stars');
        const cyclist = Array.prototype.slice.call(this.persons).filter(value => value.dataset.name === 'cyclist');
        const newParallaxElements = Array.prototype.concat.call(exceptStars, this.ground);
        const scrollHeight = this.house.offsetHeight * 2;

        this.isElementsStopped = true;

        gsap.to(this.houseContent, {
            scrollTrigger: {
                trigger: this.houseContent,
                start: `${window.innerWidth} center`,
                end: `${scrollHeight} bottom`,
                scrub: true,
                onEnter: (self) => {
                    TweenLite.to('body', {
                        overflowY: 'hidden',
                    });

                    gsap.to(cyclist, {
                        x: () => window.innerWidth * .6,
                        duration: 2,
                        ease: 'power2.out',
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
                },
                markers: true,
                onUpdate: self => {
                    let houseSpeed = self.progress * (window.innerWidth);

                    gsap.to(stars, {y: (self.progress.toFixed(3) * 200)});
                    gsap.to(newParallaxElements, {y: houseSpeed});
                    gsap.to(this.persons, {y: houseSpeed});
                    gsap.to(this.houseContent, {y: houseSpeed});

                    if (self.progress >= .95) {
                        this.houseContent.classList.add('active');
                        this.finishedElement.classList.add('active');
                    } else {
                        this.houseContent.classList.remove('active');
                        this.finishedElement.classList.remove('active');
                    }
                },
                onLeaveBack: self => {
                    this.setBodyScroll();
                    this.isElementsStopped = false;
                    console.log('LEAVE!!!', self)
                    self.kill();
                    //this.elementsTimeline.play(this.elements, false);

                    gsap.to(cyclist, {
                        x: () => 200,
                        duration: 2,
                        scrollTrigger: {
                            trigger: this.walkingContainer,
                            start: `top top`,
                            end: `top top`,
                        },
                    });
                },
            }
        });
    }
}

export default Animation;




