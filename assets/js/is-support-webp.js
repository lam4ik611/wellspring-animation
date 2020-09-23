const elem = document.createElement('canvas'),
    webpElements = document.querySelectorAll('[data-el="animated.element"], [data-el="animated.ground"]'),
    houseImage = document.querySelector('[data-name="house"]');

if (!!(elem.getContext && elem.getContext('2d'))) {
    const isSupportWebp = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    if (isSupportWebp) {
        houseImage.style.backgroundImage = `url("./images/house.webp?nocache=${new Date()}")`;
        webpElements.forEach(item => item.classList.add('webp'));
    } else {
        houseImage.style.backgroundImage = `url("./images/house.png?nocache=${new Date()}")`;
    }
}

