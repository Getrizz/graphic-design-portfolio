
// ==========================================
// DEATH LOTUS PORTFOLIO WEBSITE
// Main JavaScript
// ==========================================

const projects = window.PORTFOLIO_PROJECTS || [];

const grid = document.getElementById('project-grid');
const filters = [...document.querySelectorAll('.filter')];
const video = document.querySelector('.video-feature');
const count = document.getElementById('project-count');

const modal = document.getElementById('modal');
const modalMeta = document.getElementById('modal-meta');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPages = document.getElementById('modal-pages');
const modalOriginal = document.getElementById('modal-original');

// ==========================================
// SCROLL ANIMATION OBSERVER
// ==========================================

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('seen');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

function observeElements() {
  document.querySelectorAll(
    '.project-card, .skill-grid article, .promo-card'
  ).forEach(element => {
    observer.observe(element);
  });
}

// ==========================================
// PROJECT RENDERING
// ==========================================

function render(filter = 'All') {

  if (!grid) return;

  const shown = projects.filter(project =>
    filter === 'All' || project.period === filter
  );

  grid.innerHTML = '';

  if (shown.length === 0) {
    grid.innerHTML = `
      <div class="empty">
        No still-image projects were included for this period.
        See the Finals promotional video below.
      </div>
    `;
  }

  shown.forEach(project => {

    const card = document.createElement('article');

    card.className = 'project-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    card.setAttribute(
      'aria-label',
      'View ' + project.title
    );

    card.innerHTML = `
      <div class="project-image">
        <img
          loading="lazy"
          src="${project.thumb}"
          alt="${project.title}"
          onerror="this.style.display='none'; this.parentElement.classList.add('image-error');"
        />
      </div>

      <div class="project-meta">
        <span>${project.period}</span>

        <span>
          ${project.kind} ·
          ${project.pages.length}
          ${project.pages.length === 1 ? 'PAGE' : 'PAGES'}
        </span>
      </div>

      <h3>${project.title}</h3>

      <p>${project.description}</p>
    `;

    // Open project when clicked
    card.addEventListener('click', () => {
      openProject(project);
    });

    // Keyboard accessibility
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject(project);
      }
    });

    grid.appendChild(card);

  });

  // Show or hide Finals promotional video
  if (video) {
    video.style.display =
      (filter === 'All' || filter === 'Finals')
        ? 'grid'
        : 'none';
  }

  // Update project count
  if (count) {
    count.textContent =
      filter === 'Finals'
        ? '01'
        : String(shown.length);
  }

  // Observe newly created project cards
  observeElements();
}

// ==========================================
// PROJECT FILTERS
// ==========================================

filters.forEach(button => {

  button.addEventListener('click', () => {

    filters.forEach(filterButton => {
      filterButton.classList.toggle(
        'active',
        filterButton === button
      );
    });

    render(button.dataset.filter);

  });

});

// ==========================================
// OPEN PROJECT MODAL
// ==========================================

function openProject(project) {

  if (!modal) return;

  modalMeta.textContent =
    project.period +
    ' / ' +
    project.kind +
    ' / ' +
    project.pages.length +
    ' ' +
    (project.pages.length === 1 ? 'PAGE' : 'PAGES');

  modalTitle.textContent = project.title;
  modalDesc.textContent = project.description;

  modalPages.innerHTML = '';

  project.pages.forEach((source, index) => {

    const image = document.createElement('img');

    image.src = source;
    image.alt = project.title + ' — page ' + (index + 1);
    image.loading = 'lazy';

    image.onerror = function () {
      this.alt = 'Unable to load ' + project.title + ' page ' + (index + 1);
      this.style.display = 'none';
    };

    modalPages.appendChild(image);

  });

  modalOriginal.href = project.original;

  modalOriginal.textContent =
    'Open original ' +
    project.kind.toLowerCase() +
    ' ↗';

  modalOriginal.target = '_blank';
  modalOriginal.rel = 'noopener noreferrer';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  document.body.style.overflow = 'hidden';

}

// ==========================================
// CLOSE PROJECT MODAL
// ==========================================

function closeModal() {

  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');

  document.body.style.overflow = '';

}

const closeButton = document.querySelector('.modal-close');
const backdrop = document.querySelector('.modal-backdrop');

if (closeButton) {
  closeButton.addEventListener('click', closeModal);
}

if (backdrop) {
  backdrop.addEventListener('click', closeModal);
}

// Close modal using Escape key
document.addEventListener('keydown', event => {

  if (event.key === 'Escape') {
    closeModal();
  }

});

// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');

if (menu && nav) {

  menu.addEventListener('click', () => {

    const isOpen = nav.classList.toggle('open');

    menu.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

  });

  nav.querySelectorAll('a').forEach(link => {

    link.addEventListener('click', () => {

      nav.classList.remove('open');

      menu.setAttribute('aria-expanded', 'false');

    });

  });

}

// ==========================================
// INITIALIZE WEBSITE
// ==========================================

// Observe existing skill and promotional elements
observeElements();

// Display all projects when the page loads
render('All');
