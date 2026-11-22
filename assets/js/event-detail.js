(() => {
  const root = document.querySelector('[data-event-detail]');
  if (!root) return;
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels = {completed:'Tamamlandı', announced:'Ayrıntılar bekleniyor', ongoing:'Devam ediyor', upcoming:'Yaklaşan'};
  const date = e => e.dateLabel || (!e.startDate ? (e.status === 'completed' ? 'Tarih bilgisi paylaşılmadı' : 'Tarih duyurulacak') : new Intl.DateTimeFormat('tr-TR', {day:'numeric', month:'long', year:'numeric'}).format(new Date(e.startDate + 'T12:00:00')) + (e.endDate && e.endDate !== e.startDate ? ' – ' + new Intl.DateTimeFormat('tr-TR', {day:'numeric', month:'long', year:'numeric'}).format(new Date(e.endDate + 'T12:00:00')) : ''));
  const canApply = e => Boolean(e.applicationUrl && ['upcoming', 'ongoing'].includes(e.status));
  const apply = e => canApply(e) ? `<a class="button button--red" href="${esc(e.applicationUrl)}" target="_blank" rel="noopener noreferrer">Başvuru yap <i class="bi bi-arrow-up-right"></i></a>` : '';

  fetch('../../assets/data/events.json').then(r => { if (!r.ok) throw Error(); return r.json(); }).then(all => {
    const e = all.find(x => x.slug === root.dataset.eventDetail);
    if (!e) throw Error();
    document.title = `${e.title} | RETORİK Münazara`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', e.shortDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${e.title} | RETORİK Münazara`);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', e.shortDescription);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', `../../${e.coverImage}`);

    const gallery = e.gallery?.length ? `<section class="event-gallery-section"><div class="event-shell"><p class="eyebrow">Etkinlikten kareler</p><h2>Galeri</h2><div class="event-gallery">${e.gallery.map((src, i) => `<a href="../../${esc(src)}" class="glightbox" data-gallery="${esc(e.slug)}"><img src="../../${esc(src)}" alt="${esc(e.title)} etkinliğinden ${i + 1}. fotoğraf" loading="lazy"></a>`).join('')}</div></div></section>` : '';
    const applicationEnd = canApply(e) ? `<section class="event-apply-end"><div class="event-shell"><div><p class="eyebrow">Katılım</p><h2>Bu etkinlikte yerini al.</h2></div>${apply(e)}</div></section>` : '';
    const onlineNote = e.location?.toLocaleLowerCase('tr-TR') === 'online' ? '<p class="event-format-note"><i class="bi bi-wifi"></i> Bu organizasyon çevrim içi olarak gerçekleştirildi.</p>' : '';

    root.innerHTML = `<section class="event-detail-hero${e.coverType === 'poster' ? ' event-detail-hero--poster' : ''}"><img class="event-detail-cover" src="../../${esc(e.coverImage)}" alt="${esc(e.coverAlt || e.title)}" fetchpriority="high"><div class="event-detail-shade"></div><div class="event-shell event-detail-heading"><a href="../../organizasyonlar/" class="back-link"><i class="bi bi-arrow-left"></i> Tüm organizasyonlar</a><span class="event-status event-status--${esc(e.status)}">${esc(labels[e.status] || '')}</span><h1>${esc(e.title)}</h1><p>${esc(e.shortDescription)}</p>${apply(e)}</div></section>
      <section class="event-detail-main"><div class="event-shell event-detail-grid"><article><p class="eyebrow">RETORİK · Organizasyon</p><h2>Etkinlik hakkında</h2><p class="event-long-description">${esc(e.fullDescription)}</p>${onlineNote}${e.status === 'announced' ? '<div class="announcement-note"><strong>Bilgiler duyurulacak</strong><span>Konum ve başvuru ayrıntıları henüz paylaşılmadı.</span></div>' : ''}<div class="event-inline-apply">${apply(e)}</div></article>
        <aside class="event-facts"><div><span>Tarih</span><strong>${esc(date(e))}</strong></div><div><span>Konum</span><strong>${esc(e.location || (e.status === 'completed' ? 'Konum bilgisi paylaşılmadı' : 'Duyurulacak'))}</strong></div><div><span>Durum</span><strong>${esc(labels[e.status] || '')}</strong></div>${apply(e)}</aside></div></section>${gallery}${applicationEnd}
      <section class="related-section"><div class="event-shell"><p class="eyebrow">Keşfetmeye devam et</p><h2>Diğer organizasyonlar</h2><div class="related-grid">${all.filter(x => x.slug !== e.slug).slice(0, 3).map(x => `<a href="../${esc(x.slug)}/" class="related-card${x.coverType === 'poster' ? ' related-card--poster' : ''}"><img src="../../${esc(x.coverImage)}" alt="" loading="lazy"><span>${esc(x.title)} <i class="bi bi-arrow-up-right"></i></span></a>`).join('')}</div></div></section>`;
    if (window.GLightbox) GLightbox({selector:'.glightbox'});
  }).catch(() => { root.innerHTML = '<div class="event-shell event-missing"><h1>Organizasyon bilgisi bulunamadı</h1><a href="../../index.html#hotels">Organizasyonlara dön</a></div>'; });
})();
