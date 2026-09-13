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
    if (event.key === 'Escape') {
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

const form = document.querySelector('#application-form');
if (form) {
  const status = form.querySelector('.form__status');
  const fullNameField = form.elements.full_name;
  const workplaceField = form.elements.workplace;
  const phoneField = form.elements.phone;
  const emailField = form.elements.email;
  const consentField = form.elements.consent_personal_data;
  const namePattern = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]{1,119}$/u;

  const setFieldValidity = (field, isValid) => {
    field.setAttribute('aria-invalid', String(!isValid));
  };

  const setStatus = (message, type = '') => {
    status.className = `form__status${type ? ` form__status--${type}` : ''}`;
    status.textContent = message;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fullName = fullNameField.value.trim();
    const workplace = workplaceField.value.trim();
    const phoneDigits = phoneField.value.replace(/\D/g, '');
    const email = emailField.value.trim();
    const consent = consentField.checked;
    const isNameValid = namePattern.test(fullName) && fullName.split(/\s+/).length >= 2;
    const isWorkplaceValid = workplace.length <= 255;
    const isPhoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 15;
    const isEmailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    setFieldValidity(fullNameField, isNameValid);
    setFieldValidity(workplaceField, isWorkplaceValid);
    setFieldValidity(phoneField, isPhoneValid);
    setFieldValidity(emailField, isEmailValid);
    setFieldValidity(consentField, consent);

    if (!isNameValid || !isWorkplaceValid || !isPhoneValid || !isEmailValid || !consent) {
      const message = !isNameValid
        ? 'Укажите фамилию и имя корректно.'
        : !isPhoneValid
          ? 'Укажите телефон: от 10 до 15 цифр.'
          : !isEmailValid
            ? 'Укажите корректный email.'
            : !isWorkplaceValid
              ? 'Слишком длинное название места работы.'
              : 'Подтвердите согласие на обработку персональных данных.';
      setStatus(message, 'error');
      return;
    }

    form.reset();
    [fullNameField, workplaceField, phoneField, emailField, consentField].forEach((field) => field.removeAttribute('aria-invalid'));
    setStatus('Демо-версия на GitHub Pages: заявка не отправляется. Для приёма заявок используйте PHP-версию на хостинге.', 'notice');
  });
}
