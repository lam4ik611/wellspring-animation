import './preloader';
import './is-support-webp';
import Animation from './animation';
import MobileAnimation from './mobile-animation';

if (window.innerWidth > 1024) { // TODO
    new Animation();
} else {
    new MobileAnimation();
}
