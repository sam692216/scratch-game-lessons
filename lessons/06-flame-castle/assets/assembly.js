(() => {
  const dialog = document.getElementById('assembly-dialog');
  const image = document.getElementById('ref-img');
  const zoom = document.getElementById('ref-zoom');
  let opener;

  document.querySelectorAll('[data-ref]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      image.src = button.dataset.ref;
      image.alt = button.dataset.title;
      document.getElementById('ref-title').textContent = button.dataset.title;
      image.classList.remove('enlarged');
      zoom.textContent = '放大細節';
      dialog.showModal();
      dialog.querySelector('.image-box').scrollTo(0, 0);
    });
  });
  zoom.addEventListener('click', () => {
    zoom.textContent = image.classList.toggle('enlarged') ? '縮回畫面' : '放大細節';
  });
  document.getElementById('ref-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());

  const notes = [...document.querySelectorAll('[data-record]')];
  const prefix = 'lionlake-lesson6-assembly-observation-';
  notes.forEach(note => {
    const key = prefix + note.dataset.record;
    try { note.value = localStorage.getItem(key) || ''; } catch {}
    note.addEventListener('input', () => {
      try {
        if (note.value) localStorage.setItem(key, note.value);
        else localStorage.removeItem(key);
      } catch {}
    });
  });
  document.getElementById('clear-progress').addEventListener('click', () => {
    for (const note of notes) {
      note.value = '';
      try { localStorage.removeItem(prefix + note.dataset.record); } catch {}
    }
  });

  const pages = [...document.querySelectorAll('[data-paper]')];
  document.querySelectorAll('[data-print]').forEach(button => {
    button.addEventListener('click', () => {
      pages.forEach(page => page.hidden = page.dataset.paper !== button.dataset.print);
      window.print();
    });
  });
  window.addEventListener('afterprint', () => pages.forEach(page => page.hidden = false));
})();
