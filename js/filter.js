document.addEventListener('DOMContentLoaded', () => {
  const projectGrid = document.querySelector('main.grid');

  const searchToggle = document.getElementById('search-toggle');
  const searchInput = document.getElementById('search');
  const filterToggle = document.getElementById('filter-toggle');
  const filterWRow = document.getElementById('filter-w-row');

  // Helper to close all popouts
  function closeAllPopouts() {
    if (searchInput) {
      searchInput.classList.remove('active');
      searchInput.style.display = 'none';
      searchToggle.style.visibility = '';
    }
    if (filterWRow) {
      filterWRow.classList.remove('active');
      filterToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Search bar toggle logic
  if (searchToggle && searchInput) {
    searchToggle.addEventListener('click', () => {
      const isActive = searchInput.classList.contains('active');
      closeAllPopouts();
      if (!isActive) {
        searchInput.classList.add('active');
        searchInput.style.display = 'inline-block';
        searchInput.focus();
        searchToggle.style.visibility = 'hidden';
      }
    });
    searchInput.addEventListener('blur', () => {
      searchInput.classList.remove('active');
      setTimeout(() => {
        searchInput.style.display = 'none';
        searchToggle.style.visibility = '';
      }, 200);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.blur();
      }
    });
  }

  // Filter W's toggle logic
  if (filterToggle && filterWRow) {
    filterToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = filterWRow.classList.contains('active');
      closeAllPopouts();
      if (!isOpen) {
        filterWRow.classList.add('active');
        filterToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Close popouts when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !searchInput.contains(e.target) &&
      e.target !== searchToggle &&
      !filterWRow.contains(e.target) &&
      e.target !== filterToggle
    ) {
      closeAllPopouts();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopouts();
    }
  });

  // Only run the script if the project grid exists on this page.
  if (!projectGrid) {
    return;
  }

  const allProjects = projectGrid.querySelectorAll('.thumb');

  // Filtering logic for dynamic filter buttons
  function filterProjects(group, value) {
    allProjects.forEach(project => {
      const what = (project.dataset.what || '').toLowerCase();
      const who = (project.dataset.who || '').toLowerCase();
      const where = (project.dataset.where || '').toLowerCase();
      const when = (project.dataset.when || '').toLowerCase();
      let match = false;
      if (group === 'what') match = what === value;
      if (group === 'who') match = who === value;
      if (group === 'where') match = where === value;
      if (group === 'when') match = when === value;
      project.style.display = match ? 'block' : 'none';
    });
  }

  // Attach click listeners to dynamic filter buttons
  document.querySelectorAll('.filter-submenu').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const group = btn.getAttribute('data-filter-group');
      const value = btn.getAttribute('data-filter-value');
      filterProjects(group, value);
      closeAllPopouts();
    });
  });

  // Optionally, add a way to reset filters (e.g., clicking ABAKUS logo)
  const logoLink = document.querySelector('.logo-area a');
  if (logoLink) {
    logoLink.addEventListener('click', () => {
      allProjects.forEach(project => {
        project.style.display = 'block';
      });
    });
  }
});

