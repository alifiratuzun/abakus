document.addEventListener('DOMContentLoaded', () => {
  const projectGrid = document.querySelector('main.grid');

  // Only run the script if the project grid exists on this page.
  if (!projectGrid) {
    return;
  }

  const searchInput = document.getElementById('search');
  const filterLinks = document.querySelectorAll('nav a[data-filter]');
  const allProjects = projectGrid.querySelectorAll('.thumb');
  const allLink = document.querySelector('nav a[href="/"]');

  function filterAndSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilterLink = document.querySelector('nav a.active');
    const activeFilter = activeFilterLink ? activeFilterLink.dataset.filter : null;

    allProjects.forEach(project => {
      const title = project.querySelector('h2').textContent.toLowerCase();
      const location = project.querySelector('p').textContent.toLowerCase();
      const type = project.dataset.type;
      const year = project.dataset.year;

      const matchesSearch = title.includes(searchTerm) || location.includes(searchTerm);
      const matchesFilter = !activeFilter || activeFilter === type || activeFilter === year;

      if (matchesSearch && matchesFilter) {
        project.style.display = 'block';
      } else {
        project.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterAndSearch);
  }

  filterLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector('nav a.active')?.classList.remove('active');
      link.classList.add('active');
      filterAndSearch();
    });
  });

  if (allLink) {
    allLink.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector('nav a.active')?.classList.remove('active');
      filterAndSearch();
    });
  }
});

