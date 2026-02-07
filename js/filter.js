document.addEventListener('DOMContentLoaded', () => {
  const projectGrid = document.querySelector('main.grid');
  const projectTableBody = document.querySelector('.project-list-table tbody');
  const projectCards = projectGrid ? Array.from(projectGrid.querySelectorAll('.thumb')) : [];
  const projectRows = projectTableBody ? Array.from(projectTableBody.querySelectorAll('.project-row')) : [];
  const hasProjectTargets = projectCards.length > 0 || projectRows.length > 0;

  const searchToggle = document.getElementById('search-toggle');
  const searchInput = document.getElementById('search');
  const filterToggle = document.getElementById('filter-toggle');
  const filterWRow = document.getElementById('filter-w-row');
  const mainNav = document.querySelector('.main-nav');

  const slugify = (str = '') => str
    .toString()
    .trim()
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const getDecadeSlug = (year = '') => {
    const digits = year.replace(/[^\d]/g, '');
    if (digits.length < 3) return '';
    return `${digits.slice(0, 3)}0lar`;
  };

  // Helper to close all popouts
  function closeAllPopouts() {
    if (searchInput) {
      searchInput.classList.remove('active');
      searchInput.style.display = 'none';
      if (searchToggle) {
        searchToggle.style.display = '';
      }
    }
    if (filterWRow && filterToggle) {
      filterWRow.classList.remove('active');
      filterToggle.setAttribute('aria-expanded', 'false');
      filterToggle.classList.remove('is-active');
      if (mainNav && !mainNav.querySelector('.is-active')) {
        mainNav.classList.remove('nav-has-active');
      }
    }
  }

  const resetProjects = () => {
    projectCards.forEach(card => {
      card.style.display = 'block';
    });
    projectRows.forEach(row => {
      row.style.display = '';
    });
  };

  const matchesFilter = (data, group, value) => {
    if (!value) return true;
    if (group === 'tarih') {
      const yearSlug = slugify(data.tarih || '');
      const decadeSlug = slugify(data.decade || getDecadeSlug(data.tarih || ''));
      return value === yearSlug || (decadeSlug && value === decadeSlug);
    }
    return slugify(data[group] || '').includes(value);
  };

  const filterProjects = (group, rawValue) => {
    if (!hasProjectTargets) return;
    const value = slugify(rawValue || '');
    if (!value) {
      resetProjects();
      return;
    }
    projectCards.forEach(card => {
      const data = {
        tur: card.dataset.tur || '',
        mimar: card.dataset.mimar || '',
        yer: card.dataset.yer || '',
        tarih: card.dataset.tarih || '',
        decade: card.dataset.decade || ''
      };
      const match = matchesFilter(data, group, value);
      card.style.display = match ? 'block' : 'none';
    });
    projectRows.forEach(row => {
      const data = {
        tur: row.dataset.tur || '',
        mimar: row.dataset.mimar || '',
        yer: row.dataset.yer || '',
        tarih: row.dataset.tarih || '',
        title: row.dataset.title || ''
      };
      const match = matchesFilter(data, group, value);
      row.style.display = match ? '' : 'none';
    });
  };

  const applySearch = (query) => {
    if (!searchInput || !hasProjectTargets) return;
    const normalizedQuery = slugify(query || '');
    if (!normalizedQuery) {
      resetProjects();
      return;
    }

    projectCards.forEach(card => {
      const title = slugify(card.querySelector('h2')?.innerText || '');
      const architect = slugify(card.querySelector('.thumb-who')?.innerText || '');
      const place = slugify(card.querySelector('p')?.innerText || '');
      const match = [title, architect, place].some(str => str.includes(normalizedQuery));
      card.style.display = match ? 'block' : 'none';
    });

    projectRows.forEach(row => {
      const searchable = [
        row.dataset.title,
        row.dataset.mimar,
        row.dataset.yer,
        row.dataset.tur,
        row.dataset.tarih
      ].map(value => slugify(value || ''));
      const match = searchable.some(str => str.includes(normalizedQuery));
      row.style.display = match ? '' : 'none';
    });
  };

  // Search bar toggle logic
  if (searchToggle && searchInput) {
    searchToggle.addEventListener('click', () => {
      const isActive = searchInput.classList.contains('active');
      closeAllPopouts();
      if (!isActive) {
        searchInput.classList.add('active');
        searchInput.style.display = 'inline-block';
        searchInput.focus();
        searchToggle.style.display = 'none';
      }
    });
    searchInput.addEventListener('blur', () => {
      searchInput.classList.remove('active');
      setTimeout(() => {
        searchInput.style.display = 'none';
        if (searchToggle) {
          searchToggle.style.display = '';
        }
      }, 200);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.blur();
      }
    });
    searchInput.addEventListener('input', function () {
      applySearch(this.value.trim());
    });
  }

  // Filter dropdown toggle logic
  if (filterToggle && filterWRow) {
    filterToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = filterWRow.classList.contains('active');
      closeAllPopouts();
      if (!isOpen) {
        filterWRow.classList.add('active');
        filterToggle.setAttribute('aria-expanded', 'true');
        filterToggle.classList.add('is-active');
        if (mainNav) {
          mainNav.classList.add('nav-has-active');
        }
      }
    });
  }

  // Close popouts when clicking outside
  document.addEventListener('click', (e) => {
    const clickedOutsideSearch = !searchInput || (!searchInput.contains(e.target) && e.target !== searchToggle);
    const clickedOutsideFilter = !filterWRow || (!filterWRow.contains(e.target) && e.target !== filterToggle);
    if (clickedOutsideSearch && clickedOutsideFilter) {
      closeAllPopouts();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopouts();
    }
  });

  // Attach click listeners to filter buttons
  document.querySelectorAll('.filter-submenu').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const group = btn.getAttribute('data-filter-group');
      const value = btn.getAttribute('data-filter-value');
      filterProjects(group, value);
      closeAllPopouts();
    });
  });

  // Reset filters when clicking the logo
  const logoLink = document.querySelector('.logo-area a');
  if (logoLink) {
    logoLink.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      resetProjects();
    });
  }
});
