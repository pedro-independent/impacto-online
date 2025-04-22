import './styles/style.css'
import SplitType from 'split-type'


/* Check Section Theme on scroll */
function initCheckSectionThemeScroll() {


  const navBarHeight = document.querySelector("[data-nav-bar-height]")
  const themeObserverOffset = navBarHeight ? navBarHeight.offsetHeight / 2 : 0;

  function checkThemeSection() {
    const themeSections = document.querySelectorAll("[data-theme-section]");

    themeSections.forEach(function(themeSection) {
      const rect = themeSection.getBoundingClientRect();
      const themeSectionTop = rect.top;
      const themeSectionBottom = rect.bottom;

      if (themeSectionTop <= themeObserverOffset && themeSectionBottom >= themeObserverOffset) {
      
        const themeSectionActive = themeSection.getAttribute("data-theme-section");
        document.querySelectorAll("[data-theme-nav]").forEach(function(elem) {
          if (elem.getAttribute("data-theme-nav") !== themeSectionActive) {
            elem.setAttribute("data-theme-nav", themeSectionActive);
          }
        });

        const bgSectionActive = themeSection.getAttribute("data-bg-section");
        document.querySelectorAll("[data-bg-nav]").forEach(function(elem) {
          if (elem.getAttribute("data-bg-nav") !== bgSectionActive) {
            elem.setAttribute("data-bg-nav", bgSectionActive);
          }
        });
      }
    });
  }

  function startThemeCheck() {
    document.addEventListener("scroll", checkThemeSection);
  }

  checkThemeSection();
  startThemeCheck();
}

  initCheckSectionThemeScroll();


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

/* About animation */
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_about",
    start: "top top",
    end: "+=100%",
    scrub: true,
    pin: true,
  }
});

tl.fromTo(".about-wrap", 
  { scale: 0.4 }, 
  { scale: 1, ease: "power2.out" }
);

tl.to(".about-img-wrap.is--one", {
  rotate: -3,
  xPercent: -150,
  yPercent: -200,
  ease: "power2.out"
}, "<");

tl.to(".about-img-wrap.is--two", {
  rotate: 3,
  xPercent: 105,
  yPercent: -170,
  ease: "power2.out"
}, "<");

tl.to(".about-img-wrap.is--three", {
  rotate: -6,
  xPercent: 150,
  yPercent: 100,
  ease: "power2.out"
}, "<");

tl.to(".about-img-wrap.is--four", {
  rotate: 2,
  xPercent: -185,
  yPercent: 100,
  ease: "power2.out"
}, "<");

tl.to(".about-img-wrap.is--five", {
  rotate: -2.5,
  xPercent: -250,
  yPercent: -50,
  ease: "power2.out"
}, "<");

/* Why animation */
function initStickyTitleScroll() {
  const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');

  wraps.forEach(wrap => {
    const headings = Array.from(wrap.querySelectorAll('[data-sticky-title="heading"]'));

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 40%",
        end: "bottom bottom",
        scrub: true,
      }
    });

    const revealDuration = 1,
          fadeOutDuration = 0.5,
          overlapOffset = 0.15;

    headings.forEach((heading, index) => {
      // Set aria-label for accessibility
      heading.setAttribute("aria-label", heading.textContent);

      // Split text using SplitType
      const split = new SplitType(heading, {
        types: 'words, chars',
        tagName: 'span'
      });

      // Hide all the chars from screen readers
      split.chars.forEach(char => char.setAttribute("aria-hidden", "true"));

      // Make sure the original heading is visible
      gsap.set(heading, { visibility: "visible" });

      const headingTl = gsap.timeline();

      // Reveal animation
      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration
      });

      // Fade-out animation for all but the last one
      if (index < headings.length - 1) {
        headingTl.to(split.chars, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration
        });
      }

      if (index === 0) {
        masterTl.add(headingTl);
      } else {
        masterTl.add(headingTl, `-=${overlapOffset}`);
      }
    });
  });
}

initStickyTitleScroll();

/* Benefits sticky cards */
const imgItems = gsap.utils.toArray('.home-scroll_img-item');
const textItems = gsap.utils.toArray('.home-scroll_text-item');

// Set all image items to hidden except the first one
imgItems.forEach((img, i) => {
  gsap.set(img, { opacity: i === 0 ? 1 : 0, y: 0 });
});

textItems.forEach((text, i) => {
  ScrollTrigger.create({
    trigger: text,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => showImage(i),
    onEnterBack: () => showImage(i),
  });
});

function showImage(index) {
  imgItems.forEach((img, i) => {
    gsap.to(img, {
      opacity: i === index ? 1 : 0,
      y: i === index ? 0 : -50,
      duration: 0.6,
      ease: 'power2.out'
    });
  });
}


/* Testimonials Marquee */
function initMarqueeScrollDirection() {
  document.querySelectorAll('[data-marquee-scroll-direction-target]').forEach((marquee) => {
    const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
    const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
    if (!marqueeContent || !marqueeScroll) return;

    const { marqueeSpeed: speed, marqueeDirection: direction, marqueeDuplicate: duplicate, marqueeScrollSpeed: scrollSpeed } = marquee.dataset;

    const marqueeSpeedAttr = parseFloat(speed);
    const marqueeDirectionAttr = direction === 'right' ? 1 : -1;
    const duplicateAmount = parseInt(duplicate || 0);
    const scrollSpeedAttr = parseFloat(scrollSpeed);
    const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

    let marqueeSpeed = marqueeSpeedAttr * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier;

    marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
    marqueeScroll.style.width = `${(scrollSpeedAttr * 2) + 100}%`;

    if (duplicateAmount > 0) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < duplicateAmount; i++) {
        fragment.appendChild(marqueeContent.cloneNode(true));
      }
      marqueeScroll.appendChild(fragment);
    }

    const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
    const animation = gsap.to(marqueeItems, {
      xPercent: -100,
      repeat: -1,
      duration: marqueeSpeed,
      ease: 'linear'
    }).totalProgress(0.5);

    gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
    animation.timeScale(marqueeDirectionAttr);
    animation.play();

    marquee.setAttribute('data-marquee-status', 'normal');

    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const isInverted = self.direction === 1;
        const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr;

        animation.timeScale(currentDirection);
        marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marquee,
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0
      }
    });

    const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
    const scrollEnd = -scrollStart;

    tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' });
  });
}

  initMarqueeScrollDirection();

/* Team Overlay */
const teamItems = document.querySelectorAll(".team-item");
const overlay = document.querySelector(".team-overlay");
const closeIcon = document.querySelector(".close-modal-btn");

function openModal() {
  lenis.stop();
}

function closeModal() {
  lenis.start();
}

function hideOverlay() {
  const activeBio = overlay.querySelector(".team-bio-item.active");

  if (activeBio) {
    gsap.to(activeBio, {
      y: "100vh",
      duration: 0.75,
      ease: "power3.out",
      onComplete: () => {
        activeBio.classList.remove("active");
        gsap.set(overlay, { display: "none" });
        gsap.set(activeBio, { clearProps: "y" });
        closeModal();
      }
    });
  } else {
    gsap.set(overlay, { display: "none" });
    closeModal();
  }
}

teamItems.forEach(item => {
  item.addEventListener("click", () => {
    const name = item.getAttribute("data-name");
    const allBios = overlay.querySelectorAll(".team-bio-item");

    gsap.set(overlay, { display: "block" });
    openModal();

    allBios.forEach(bio => {
      gsap.set(bio, { y: "100vh" });
      bio.classList.remove("active");
    });

    const targetBio = overlay.querySelector(`.team-bio-item[data-name="${name}"]`);
    if (targetBio) {
      targetBio.classList.add("active");
      gsap.to(targetBio, {
        y: 0,
        duration: 0.75,
        ease: "power3.out"
      });
    }
  });
});

overlay.addEventListener("click", (e) => {
  if (e.target.closest(".team-bio-item")) return;
  hideOverlay();
});

overlay.addEventListener("click", (e) => {
  if (e.target.closest(".close-modal-btn")) {
    hideOverlay();
    return;
  }

  if (!e.target.closest(".team-bio-item")) {
    hideOverlay();
  }
});


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const isOverlayVisible = window.getComputedStyle(overlay).display !== "none";
    if (isOverlayVisible) {
      hideOverlay();
    }
  }
});

/* Accordion FAQ */
function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return; // Exit if the clicked element is not a toggle

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return; // Exit if no accordion container is found

      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
      
      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}
  initAccordionCSS();