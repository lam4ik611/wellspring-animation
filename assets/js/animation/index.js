import Animation from './animation';
import MobileAnimation from './mobile-animation';

const preloader = document.querySelector('[data-el="preloader"]');

if (window.innerWidth > 1024) { // TODO
    new Animation();
} else {
    new MobileAnimation();
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 2000);
});
