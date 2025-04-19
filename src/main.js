import './styles/style.css'

/* Buttons */
function initButtonCharacterStagger() {
    const offsetIncrement = 0.01;
    const buttons = document.querySelectorAll('[data-button-animate]');
  
    buttons.forEach(button => {
      const text = button.textContent;
      button.innerHTML = '';
  
      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.transitionDelay = `${index * offsetIncrement}s`;
  
        if (char === ' ') {
          span.style.whiteSpace = 'pre';
        }
  
        button.appendChild(span);
      });
    });
  }
  
initButtonCharacterStagger();

gsap.registerPlugin(ScrollTrigger)

gsap.set(".about-container", { scale: 0.4, opacity: 0 });


const aboutScrollTrigger = {
  trigger: '.about-container',
  pin: true,
  start: 'top center',
  end: 'bottom center',
  scrub: 1,
  markers: true,
};

gsap.to(".about-container", {
  scale: 1,
  opacity: 1,
  scrollTrigger: aboutScrollTrigger
});

gsap.to(".about-img-wrap.is--one", {
  rotate: -3,
  xPercent: -100,
  yPercent: -170,
  scrollTrigger: aboutScrollTrigger
});

// gsap.to(".about-img-wrap.is--two", {
//   rotate: 5,
//   xPercent: 50,
//   yPercent: -100,
//   scrollTrigger: aboutScrollTrigger
// });
