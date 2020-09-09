const preloader = document.querySelector('[data-el="preloader"]');

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.overflow = 'auto';
    }, 2000);
});
