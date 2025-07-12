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
      const tur = (project.dataset.tur || '').toLowerCase();
      const mimar = (project.dataset.mimar || '').toLowerCase();
      const yer = (project.dataset.yer || '').toLowerCase();
      let tarih = (project.dataset.tarih || '').toLowerCase();
      // If filtering by decade, derive the decade from the year if needed
      if (group === 'tarih' && tarih.length === 4 && !tarih.includes("'lar")) {
        tarih = tarih.slice(0, 3) + "0'lar";
      }
      // Slugify for comparison
      function slugify(str) {
        return str.replace(/['’]/g, '').replace(/\s+/g, '-').toLowerCase();
      }
      let match = false;
      if (group === 'tur') match = tur === value;
      if (group === 'mimar') {
        // Split architects, slugify each, and compare to value
        match = mimar.split(',').map(s => s.trim().replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/\s+/g, '-').toLowerCase()).includes(value);
      }
      if (group === 'yer') match = yer === value;
      if (group === 'tarih') match = tarih === value;
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

  // Live search for homepage projects
  if (searchInput && projectGrid) {
    searchInput.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      allProjects.forEach(project => {
        const title = (project.querySelector('h2')?.innerText || '').toLowerCase();
        const mimar = (project.querySelector('.thumb-who')?.innerText || '').toLowerCase();
        const yer = (project.querySelector('p')?.innerText || '').toLowerCase();
        if (
          title.includes(query) ||
          mimar.includes(query) ||
          yer.includes(query)
        ) {
          project.style.display = 'block';
        } else {
          project.style.display = 'none';
        }
      });
    });
  }
});

