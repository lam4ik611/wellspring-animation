import {gsap, TweenMax} from './gsap';
import ScrollTrigger from './gsap/ScrollTrigger';
import ScrollToPlugin from './gsap/ScrollToPlugin';
import Draggable from './gsap/Draggable';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(TweenMax);

const animatedContainer = '[data-el="animated.container"]',
    animatedElement = '[data-el="animated.element"]',
    viewportHeight = window.innerHeight,
    scrollHeight = document.querySelector(animatedContainer).offsetWidth - 925;

TweenMax.set('body', {
    height: scrollHeight,
    overflowY:'scroll',
});

document.addEventListener('scroll', () => {
    const currentScrollPosition = document.documentElement.scrollTop;
    const elements = document.querySelectorAll(animatedElement);

    elements.forEach(item => {
        const itemSpeed = item.dataset.speed;

        TweenMax
            .from(item, {
                x: -itemSpeed * currentScrollPosition,
            });
    })

    //  '0.5' = half speed of user scroll
    console.log(currentScrollPosition);
});




