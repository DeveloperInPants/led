const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.navigation__list');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
  });

  menu.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      menuButton.focus();
    }
  });
}

const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('reveal--visible'));
}

const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  const updateBackToTop = () => {
    backToTop.hidden = window.scrollY < 600;
  };

  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const pricingGrids = document.querySelectorAll('.pricing-grid--plans');
if (pricingGrids.length) {
  const alignPricingAudiences = () => {
    const isDesktop = window.matchMedia('(min-width: 52rem)').matches;
    pricingGrids.forEach((grid) => {
      const featureLists = [...grid.querySelectorAll('.pricing-plan ul')];
      featureLists.forEach((list) => {
        list.style.minHeight = '';
      });
      if (!isDesktop) return;
      const tallestList = Math.ceil(Math.max(...featureLists.map((list) => list.getBoundingClientRect().height)));
      featureLists.forEach((list) => {
        list.style.minHeight = `${tallestList}px`;
      });
    });
  };

  alignPricingAudiences();
  window.addEventListener('resize', alignPricingAudiences, { passive: true });
}

const demoNotice = document.querySelector('#demo-notice');
const demoNoticeTriggers = document.querySelectorAll('[data-demo-notice]');

if (demoNotice && demoNoticeTriggers.length) {
  const closeButtons = demoNotice.querySelectorAll('[data-demo-notice-close]');
  const focusableSelector = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
  let lastTrigger = null;

  const closeDemoNotice = () => {
    if (demoNotice.hidden) return;
    demoNotice.hidden = true;
    document.body.classList.remove('has-demo-notice');
    lastTrigger?.focus();
  };

  const openDemoNotice = (trigger) => {
    lastTrigger = trigger;
    demoNotice.hidden = false;
    document.body.classList.add('has-demo-notice');
    const firstFocusable = demoNotice.querySelector(focusableSelector);
    requestAnimationFrame(() => firstFocusable?.focus());
  };

  demoNoticeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openDemoNotice(trigger);
    });
  });

  closeButtons.forEach((button) => button.addEventListener('click', closeDemoNotice));
  demoNotice.addEventListener('click', (event) => {
    if (event.target === demoNotice) closeDemoNotice();
  });

  document.addEventListener('keydown', (event) => {
    if (demoNotice.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDemoNotice();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...demoNotice.querySelectorAll(focusableSelector)];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
