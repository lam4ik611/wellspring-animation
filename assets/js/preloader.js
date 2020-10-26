import imagesLoaded from 'imagesloaded';

const promise = new Promise((resolve, reject) => {
    const wrapper = document.querySelector('.wrapper');
    const preloader = document.querySelector('[data-el="preloader"]');

    const imgLoad = imagesLoaded(wrapper, {background: true});
    imgLoad.on('always', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');

            resolve();
        }, 1000);
    });
});

async function preloader() {
    await promise;
    return true;
}

export default preloader();
