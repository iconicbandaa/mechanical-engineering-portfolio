const storagePrefix = 'ankit-portfolio-';

const restoreFields = () => {
  document.querySelectorAll('[data-profile], [data-skill], [data-cert], [data-cert-org]').forEach((field) => {
    const kind = field.dataset.profile ? 'profile' : field.dataset.skill ? 'skill' : field.dataset.cert ? 'cert' : 'cert-org';
    const key = field.dataset.profile || field.dataset.skill || field.dataset.cert || field.dataset.certOrg;
    const saved = localStorage.getItem(`${storagePrefix}${kind}-${key}`);
    if (saved !== null) field.value = saved;
  });
};

const migrateCertificationDefaults = () => {
  const migrationKey = `${storagePrefix}cert-defaults-v1`;
  if (localStorage.getItem(migrationKey)) return;

  document.querySelectorAll('[data-cert], [data-cert-org]').forEach((field) => {
    const kind = field.dataset.cert ? 'cert' : 'cert-org';
    const key = field.dataset.cert || field.dataset.certOrg;
    const storageKey = `${storagePrefix}${kind}-${key}`;
    const saved = localStorage.getItem(storageKey);
    if ((saved === null || saved === '') && field.value) localStorage.setItem(storageKey, field.value);
  });

  localStorage.setItem(migrationKey, 'true');
};

const persistFields = () => {
  document.querySelectorAll('[data-profile], [data-skill], [data-cert], [data-cert-org]').forEach((field) => {
    field.addEventListener('input', () => {
      const kind = field.dataset.profile ? 'profile' : field.dataset.skill ? 'skill' : field.dataset.cert ? 'cert' : 'cert-org';
      const key = field.dataset.profile || field.dataset.skill || field.dataset.cert || field.dataset.certOrg;
      localStorage.setItem(`${storagePrefix}${kind}-${key}`, field.value);
    });
    field.addEventListener('change', () => {
      const kind = field.dataset.profile ? 'profile' : field.dataset.skill ? 'skill' : field.dataset.cert ? 'cert' : 'cert-org';
      const key = field.dataset.profile || field.dataset.skill || field.dataset.cert || field.dataset.certOrg;
      localStorage.setItem(`${storagePrefix}${kind}-${key}`, field.value);
    });
  });
};

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation?.classList.toggle('is-open', !isOpen);
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

migrateCertificationDefaults();
restoreFields();
persistFields();
document.querySelector('#current-year').textContent = new Date().getFullYear();
if (window.lucide) window.lucide.createIcons();
