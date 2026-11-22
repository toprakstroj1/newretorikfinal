(() => {
  const grid = document.querySelector('#event-grid');
  if (!grid) return;
  const filters = [...document.querySelectorAll('[data-event-filter]')];
  const dialog = document.querySelector('#event-preview');
  const content = dialog?.querySelector('[data-preview-content]');
  const assetPrefix = grid.dataset.assetPrefix || '';
  const detailPrefix = grid.hasAttribute('data-detail-prefix') ? grid.dataset.detailPrefix : 'organizasyonlar/';
  let events = [];
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date = e => e.dateLabel || (!e.startDate ? (e.status === 'completed' ? 'Tarih bilgisi paylaşılmadı' : 'Tarih duyurulacak') : new Intl.DateTimeFormat('tr-TR', {day:'numeric', month:'long', year:'numeric'}).format(new Date(e.startDate + 'T12:00:00')) + (e.endDate && e.endDate !== e.startDate ? ' – ' + new Intl.DateTimeFormat('tr-TR', {day:'numeric', month:'long', year:'numeric'}).format(new Date(e.endDate + 'T12:00:00')) : ''));
  const labels = {completed:'Tamamlandı', announced:'Ayrıntılar bekleniyor', ongoing:'Devam ediyor', upcoming:'Yaklaşan'};
  const detailUrl = e => `${detailPrefix}${encodeURIComponent(e.slug)}/`;
  const imageUrl = e => `${assetPrefix}${e.coverImage}`;
  const apply = e => e.applicationUrl && ['upcoming', 'ongoing'].includes(e.status) ? `<a class="button button--red event-card__apply" href="${esc(e.applicationUrl)}" target="_blank" rel="noopener noreferrer">Başvur <i class="bi bi-arrow-up-right"></i></a>` : '';

  function render(filter = 'all') {
    const list = filter === 'all' ? events : events.filter(e => e.status === filter || (filter === 'upcoming' && e.status === 'announced'));
    grid.innerHTML = list.map(e => `<article class="event-card">
      <button class="event-card__preview" type="button" data-preview="${esc(e.slug)}" aria-label="${esc(e.title)} önizlemesini aç">
        <span class="event-card__image${e.coverType === 'poster' ? ' event-card__image--poster' : ''}"><img src="${esc(imageUrl(e))}" alt="${esc(e.coverAlt || `${e.title} etkinlik görseli`)}" loading="lazy"><span class="event-status event-status--${esc(e.status)}">${esc(labels[e.status] || '')}</span></span>
      </button>
      <div class="event-card__body"><span class="event-card__meta">${esc(date(e))}${e.location ? ` · ${esc(e.location)}` : ''}</span>
        <h3>${esc(e.title)}</h3><p>${esc(e.shortDescription)}</p>
        <div class="event-card__actions"><a class="button button--dark" href="${esc(detailUrl(e))}">Etkinlik detayları <i class="bi bi-arrow-up-right"></i></a>${apply(e)}</div>
      </div>
    </article>`).join('') || '<p class="event-empty">Bu kategoride etkinlik bulunmuyor.</p>';
  }

  fetch(grid.dataset.source || 'assets/data/events.json').then(r => { if (!r.ok) throw Error(); return r.json(); }).then(data => { events = data; render(); }).catch(() => { grid.innerHTML = '<p class="event-empty">Organizasyonlar şu anda yüklenemiyor.</p>'; });
  filters.forEach(btn => btn.addEventListener('click', () => { filters.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); }); render(btn.dataset.eventFilter); }));
  const close = () => { if (dialog?.open) dialog.close(); };
  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-preview]');
    if (!btn || !content || !dialog) return;
    const item = events.find(x => x.slug === btn.dataset.preview);
    if (!item) return;
    content.innerHTML = `<div class="preview-media${item.coverType === 'poster' ? ' preview-media--poster' : ''}"><img src="${esc(imageUrl(item))}" alt="${esc(item.coverAlt || item.title)}"></div><div class="preview-copy"><span class="event-status event-status--${esc(item.status)}">${esc(labels[item.status] || '')}</span><p class="event-card__meta">${esc(date(item))}${item.location ? ` · ${esc(item.location)}` : ''}</p><h2 id="preview-title">${esc(item.title)}</h2><p>${esc(item.shortDescription)}</p><div class="preview-actions"><a class="button button--dark" href="${esc(detailUrl(item))}">Etkinlik detayları <i class="bi bi-arrow-up-right"></i></a>${apply(item)}</div></div>`;
    dialog.showModal();
  });
  dialog?.querySelector('[data-preview-close]')?.addEventListener('click', close);
  dialog?.addEventListener('click', e => { if (e.target === dialog) close(); });
})();
