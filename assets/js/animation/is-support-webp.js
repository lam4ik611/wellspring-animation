const elem = document.createElement('canvas'),
    webpElements = document.querySelectorAll('[data-el="animated.element"], [data-el="animated.ground"]');

if (!!(elem.getContext && elem.getContext('2d'))) {
    const isSupportWebp = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    if (isSupportWebp) {
        webpElements.forEach(item => item.classList.add('webp'));
    }
}

