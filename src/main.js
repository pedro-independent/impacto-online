import "./styles/style.css";
import SplitType from "split-type";

function initWelcomingWordsLoader() {
  const loadingContainer = document.querySelector('[data-loading-container]');
  if (!loadingContainer) return;

  // --- Main Logic: Check sessionStorage ---
  // If 'loaderShown' is found in sessionStorage, hide the container and exit.
  if (sessionStorage.getItem('loaderShown')) {
    gsap.set(loadingContainer, { display: 'none' });
    return;
  }

  // --- If we reach here, it's the first load of the session. ---
  
  // Make the loader visible before starting the animation
  gsap.set(loadingContainer, { display: 'block' });

  const loadingWords = loadingContainer.querySelector('[data-loading-words]');
  const wordsTarget = loadingWords.querySelector('[data-loading-words-target]');
  const words = loadingWords.getAttribute('data-loading-words').split(',').map(w => w.trim());

  const tl = gsap.timeline({
    // Add an onComplete callback to the whole timeline
    onComplete: () => {
      // Once the entire animation is finished, set the flag in sessionStorage.
      sessionStorage.setItem('loaderShown', 'true');
      console.log("Loader animation complete. Session flag set.");
    }
  });

  tl.set(loadingWords, {
    yPercent: 50
  });

  tl.to(loadingWords, {
    opacity: 1,
    yPercent: 0,
    duration: 1,
    ease: "expo.inOut"
  });

  words.forEach(word => {
    tl.to(wordsTarget, {
      duration: 0.25, // A small duration for the text to "hold"
      onStart: () => { // Use onStart to change the text content precisely
        wordsTarget.textContent = word;
      }
    });
  });

  tl.to(loadingWords, {
    opacity: 0,
    yPercent: -75,
    duration: 0.8,
    ease: "expo.in"
  }, "+=0.25"); // Add a slight delay after the last word

  tl.to(loadingContainer, {
    autoAlpha: 0, // autoAlpha handles both opacity and visibility
    duration: 0.6,
    ease: "power1.inOut"
  }, "-=0.2"); // Overlap this animation slightly with the previous one
}

// Run the loader logic when the DOM is ready.
document.addEventListener("DOMContentLoaded", initWelcomingWordsLoader);

/* Check Section Theme on scroll */
function initCheckSectionThemeScroll() {
  const navBarHeight = document.querySelector("[data-nav-bar-height]");
  const themeObserverOffset = navBarHeight ? navBarHeight.offsetHeight / 2 : 0;

  function checkThemeSection() {
    const themeSections = document.querySelectorAll("[data-theme-section]");

    themeSections.forEach(function (themeSection) {
      const rect = themeSection.getBoundingClientRect();
      const themeSectionTop = rect.top;
      const themeSectionBottom = rect.bottom;

      if (
        themeSectionTop <= themeObserverOffset &&
        themeSectionBottom >= themeObserverOffset
      ) {
        const themeSectionActive =
          themeSection.getAttribute("data-theme-section");
        document.querySelectorAll("[data-theme-nav]").forEach(function (elem) {
          if (elem.getAttribute("data-theme-nav") !== themeSectionActive) {
            elem.setAttribute("data-theme-nav", themeSectionActive);
          }
        });

        const bgSectionActive = themeSection.getAttribute("data-bg-section");
        document.querySelectorAll("[data-bg-nav]").forEach(function (elem) {
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
  const buttons = document.querySelectorAll("[data-button-animate]");

  buttons.forEach((button) => {
    const text = button.textContent;
    button.innerHTML = "";

    [...text].forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      if (char === " ") {
        span.style.whiteSpace = "pre";
      }

      button.appendChild(span);
    });
  });
}

initButtonCharacterStagger();

/* Mobile Menu */
function initCenteredScalingNavigationBar() {
  const navigationInnerItems = document.querySelectorAll("[data-navigation-item]")
  
  // Apply CSS transition delay
  navigationInnerItems.forEach((item, index)=> {
      item.style.transitionDelay = `${index * 0.05}s`;
  });
  
  // Toggle Navigation
  document.querySelectorAll('[data-navigation-toggle="toggle"]').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) return;
      if (navStatusEl.getAttribute('data-navigation-status') === 'not-active') {
        navStatusEl.setAttribute('data-navigation-status', 'active');
      } else {
        navStatusEl.setAttribute('data-navigation-status', 'not-active');
      }
    });
  });

  // Close Navigation
  document.querySelectorAll('[data-navigation-toggle="close"]').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) return;
      navStatusEl.setAttribute('data-navigation-status', 'not-active');
    });
  });

  // Key ESC - Close Navigation
  document.addEventListener('keydown', e => {
    if (e.keyCode === 27) {
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) return;
      if (navStatusEl.getAttribute('data-navigation-status') === 'active') {
        navStatusEl.setAttribute('data-navigation-status', 'not-active');
      }
    }
  });
}

  initCenteredScalingNavigationBar();

/* Register GSAP */
gsap.registerPlugin(SplitText, ScrollTrigger);

/* Split Headings for reveal on scroll */
let headings = document.querySelectorAll('[data-split="heading"]');
headings.forEach((heading) => {
  SplitText.create(heading, {
    type: "lines",
    autoSplit: true,
    mask: "lines",
    onSplit(instance) {
      return gsap.from(instance.lines, {
        duration: 0.5,
        yPercent: 110,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          once: true,
        },
      });
    },
  });
});

/* About animation */
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_about",
    start: "top top",
    end: "+=100%",
    scrub: 1,
    pin: true,
    //markers: true,
  },
});

tl.fromTo(".about-wrap", { scale: 0.4 }, { scale: 1, ease: "power2.out" });

tl.to(
  ".about-img-wrap.is--one",
  {
    rotate: -3,
    xPercent: -150,
    yPercent: -200,
    ease: "power2.out",
  },
  "<"
);

tl.to(
  ".about-img-wrap.is--two",
  {
    rotate: 3,
    xPercent: 105,
    yPercent: -170,
    ease: "power2.out",
  },
  "<"
);

tl.to(
  ".about-img-wrap.is--three",
  {
    rotate: -6,
    xPercent: 150,
    yPercent: 100,
    ease: "power2.out",
  },
  "<"
);

tl.to(
  ".about-img-wrap.is--four",
  {
    rotate: 2,
    xPercent: -185,
    yPercent: 100,
    ease: "power2.out",
  },
  "<"
);

tl.to(
  ".about-img-wrap.is--five",
  {
    rotate: -2.5,
    xPercent: -250,
    yPercent: -50,
    ease: "power2.out",
  },
  "<"
);

/* Why animation */
function initStickyTitleScroll() {
  const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');

  wraps.forEach((wrap) => {
    const headings = Array.from(
      wrap.querySelectorAll('[data-sticky-title="heading"]')
    );

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 40%",
        end: "bottom bottom",
        scrub: true,
      },
    });

    const revealDuration = 1,
      fadeOutDuration = 0.5,
      overlapOffset = 0.15;

    headings.forEach((heading, index) => {
      heading.setAttribute("aria-label", heading.textContent);

      // Split text using SplitType
      const split = new SplitType(heading, {
        types: "words, chars",
        tagName: "span",
      });

      // Hide all the chars from screen readers
      split.chars.forEach((char) => char.setAttribute("aria-hidden", "true"));

      // Make sure the original heading is visible
      gsap.set(heading, { visibility: "visible" });

      const headingTl = gsap.timeline();

      // Reveal animation
      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration,
      });

      // Fade-out animation for all but the last one
      if (index < headings.length - 1) {
        headingTl.to(split.chars, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration,
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
const images = gsap.utils.toArray('.benefits-img');
            const texts = gsap.utils.toArray('.benefits-text-item');

            gsap.set(texts.slice(1), { opacity: 0, y: '4rem' });
            gsap.set(texts[0], { opacity: 1, y: '0rem' });
            gsap.set(images[0], { transform: 'translateY(0%)'});

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.section_benefits',
                    pin: '.benefits-container',
                    start: 'top top',
                    end: '+=200%',
                    scrub: 1,
                },
            });

            images.forEach((image, index) => {
                if (index === 0) return;

                timeline
                    .to(image, { 
                        y: '0%', 
                        duration: 1, 
                        ease: 'power1.out' 
                    })
                    .to(texts[index - 1], { 
                        opacity: 0, 
                        y: '-4rem', 
                        duration: 0.75,
                        ease: 'power1.out' 
                    }, '<')
                    .to(texts[index], { 
                        opacity: 1, 
                        y: '0rem', 
                        duration: 0.75,
                        ease: 'power1.out' 
                    }, '<+=0.5');
            });

/* Testimonials Marquee */
function initMarqueeScrollDirection() {
  document
    .querySelectorAll("[data-marquee-scroll-direction-target]")
    .forEach((marquee) => {
      const marqueeContent = marquee.querySelector(
        "[data-marquee-collection-target]"
      );
      const marqueeScroll = marquee.querySelector(
        "[data-marquee-scroll-target]"
      );
      if (!marqueeContent || !marqueeScroll) return;

      const {
        marqueeSpeed: speed,
        marqueeDirection: direction,
        marqueeDuplicate: duplicate,
        marqueeScrollSpeed: scrollSpeed,
      } = marquee.dataset;

      const marqueeSpeedAttr = parseFloat(speed);
      const marqueeDirectionAttr = direction === "right" ? 1 : -1;
      const duplicateAmount = parseInt(duplicate || 0);
      const scrollSpeedAttr = parseFloat(scrollSpeed);
      const speedMultiplier =
        window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

      let marqueeSpeed =
        marqueeSpeedAttr *
        (marqueeContent.offsetWidth / window.innerWidth) *
        speedMultiplier;

      marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
      marqueeScroll.style.width = `${scrollSpeedAttr * 2 + 100}%`;

      if (duplicateAmount > 0) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < duplicateAmount; i++) {
          fragment.appendChild(marqueeContent.cloneNode(true));
        }
        marqueeScroll.appendChild(fragment);
      }

      const marqueeItems = marquee.querySelectorAll(
        "[data-marquee-collection-target]"
      );
      const animation = gsap
        .to(marqueeItems, {
          xPercent: -100,
          repeat: -1,
          duration: marqueeSpeed,
          ease: "linear",
        })
        .totalProgress(0.5);

      gsap.set(marqueeItems, {
        xPercent: marqueeDirectionAttr === 1 ? 100 : -100,
      });
      animation.timeScale(marqueeDirectionAttr);
      animation.play();

      marquee.setAttribute("data-marquee-status", "normal");

      ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const isInverted = self.direction === 1;
          const currentDirection = isInverted
            ? -marqueeDirectionAttr
            : marqueeDirectionAttr;

          animation.timeScale(currentDirection);
          marquee.setAttribute(
            "data-marquee-status",
            isInverted ? "normal" : "inverted"
          );
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: marquee,
          start: "0% 100%",
          end: "100% 0%",
          scrub: 0,
        },
      });

      const scrollStart =
        marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
      const scrollEnd = -scrollStart;

      tl.fromTo(
        marqueeScroll,
        { x: `${scrollStart}vw` },
        { x: `${scrollEnd}vw`, ease: "none" }
      );
    });
}

initMarqueeScrollDirection();

/* Team Overlay */
const teamItems = document.querySelectorAll(".team-item");
const overlay = document.querySelector(".team-overlay");


function openModal() {
  if (window.lenis) lenis.stop();
}

function closeModal() {
  if (window.lenis) lenis.start();
}

function hideOverlay() {
  const activeBio = overlay.querySelector(".team-bio-item.active");

  if (activeBio) {
    gsap.to(activeBio, {
      yPercent: 50,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power3.in",
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        gsap.set(activeBio, { display: 'none' });
        activeBio.classList.remove("active");
        closeModal();
      },
    });
  } else {
    gsap.set(overlay, { display: "none"});
    closeModal();
  }
}

teamItems.forEach((item) => {
  item.addEventListener("click", () => {
    const name = item.getAttribute("data-name");
    const allBios = overlay.querySelectorAll(".team-bio-item");
    const targetBio = overlay.querySelector(
      `.team-bio-item[data-name="${name}"]`
    );

    if (!targetBio) {
      console.warn(`No team-bio-item found with data-name="${name}"`);
      return;
    }
    
    allBios.forEach((bio) => {
      gsap.set(bio, { display: 'none' });
      bio.classList.remove('active');
    });

    targetBio.classList.add('active');
    gsap.set(overlay, { display: 'block' });
    openModal();

    gsap.fromTo(
      targetBio,
      {
        display: 'block',
        yPercent: 50,
        autoAlpha: 0,
      },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.75,
        ease: "power3.out",
      }
    );
  });
});

overlay.addEventListener("click", (e) => {
  if (e.target.closest(".close-modal-btn") || e.target === overlay) {
    hideOverlay();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && window.getComputedStyle(overlay).display !== "none") {
    hideOverlay();
  }
});

/* Accordion FAQ */
function initAccordionCSS() {
  document
    .querySelectorAll("[data-accordion-css-init]")
    .forEach((accordion) => {
      const closeSiblings =
        accordion.getAttribute("data-accordion-close-siblings") === "true";

      accordion.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-accordion-toggle]");
        if (!toggle) return; 

        const singleAccordion = toggle.closest("[data-accordion-status]");
        if (!singleAccordion) return; 

        const isActive =
          singleAccordion.getAttribute("data-accordion-status") === "active";
        singleAccordion.setAttribute(
          "data-accordion-status",
          isActive ? "not-active" : "active"
        );

        if (closeSiblings && !isActive) {
          accordion
            .querySelectorAll('[data-accordion-status="active"]')
            .forEach((sibling) => {
              if (sibling !== singleAccordion)
                sibling.setAttribute("data-accordion-status", "not-active");
            });
        }
      });
    });
}
initAccordionCSS();

/* Open Form Modal */
document.addEventListener("DOMContentLoaded", () => {
  const formTriggers = document.querySelectorAll('[open-form]');
  const formOverlay = document.querySelector(".form-overlay"); 
  const formModalContent = document.querySelector(".form");

  if (!formTriggers.length || !formOverlay || !formModalContent) {
    console.warn("Form modal elements not found. Script will not run.");
    return;
  }

  function openFormScrollLock() {
    if (window.lenis) {
      window.lenis.stop();
    }
  }

  function closeFormScrollLock() {
    if (window.lenis) {
      window.lenis.start();
    }
  }

  function hideFormOverlay() {
    gsap.to(formModalContent, {
      yPercent: 50,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power3.in",
      onComplete: () => {
        gsap.set(formOverlay, { display: "none" });
        closeFormScrollLock();
      },
    });
  }
  
  formTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      gsap.set(formOverlay, { display: "block" });
      openFormScrollLock();

      gsap.fromTo(
        formModalContent,
        {
          yPercent: 50,
          autoAlpha: 0,
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.75,
          ease: "power3.out",
        }
      );
    });
  });

  formOverlay.addEventListener("click", (e) => {
    if (e.target.closest(".close-form-btn") || e.target === formOverlay) {
      hideFormOverlay();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && window.getComputedStyle(formOverlay).display !== "none") {
      hideFormOverlay();
    }
  });
});
