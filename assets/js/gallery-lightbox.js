(() => {
  const gallery = document.querySelector('#galeri');
  const dialog = document.querySelector('#gallery-lightbox');
  if (!gallery || !dialog || typeof dialog.showModal !== 'function') return;

  const links = [...gallery.querySelectorAll('.gallery-lightbox-trigger')];
  const image = dialog.querySelector('[data-gallery-image]');
  const caption = dialog.querySelector('[data-gallery-caption]');
  const closeButton = dialog.querySelector('[data-gallery-close]');
  const previousButton = dialog.querySelector('[data-gallery-prev]');
  const nextButton = dialog.querySelector('[data-gallery-next]');
  let activeIndex = 0;
  let returnFocus = null;
  let returnScrollY = 0;

  function showImage(index) {
    activeIndex = (index + links.length) % links.length;
    const link = links[activeIndex];
    const thumb = link.querySelector('img');
    image.src = link.href;
    image.alt = thumb?.alt || '';
    caption.textContent = link.querySelector('span')?.textContent.trim() || image.alt;
  }

  function openImage(index, trigger) {
    returnFocus = trigger;
    returnScrollY = window.scrollY;
    showImage(index);
    document.documentElement.classList.add('gallery-lightbox-open');
    document.body.classList.add('gallery-lightbox-open');
    dialog.showModal();
    closeButton.focus({preventScroll:true});
  }

  links.forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault();
    openImage(index, link);
  }));

  closeButton.addEventListener('click', () => dialog.close());
  previousButton.addEventListener('click', () => showImage(activeIndex - 1));
  nextButton.addEventListener('click', () => showImage(activeIndex + 1));

  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showImage(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(activeIndex + 1);
    }
  });

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('gallery-lightbox-open');
    document.body.classList.remove('gallery-lightbox-open');
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
    window.scrollTo({left:0, top:returnScrollY, behavior:'instant'});
  });
})();
