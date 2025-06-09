document.querySelectorAll('nav a[data-filter]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const filter = link.dataset.filter;
    document.querySelectorAll('.thumb').forEach(el => {
      el.style.display = (el.dataset.type === filter || el.dataset.year === filter) ? 'block' : 'none';
    });
  });
});

document.getElementById('search').addEventListener('input', function(e) {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.thumb').forEach(el => {
    const text = el.textContent.toLowerCase();
    el.style.display = text.includes(term) ? 'block' : 'none';
  });
});
