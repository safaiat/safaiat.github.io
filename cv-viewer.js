// Render the current PDF as part of the page, without browser viewer chrome.
const host = document.querySelector('#cv-pages');
if (location.protocol === 'http:' || location.protocol === 'https:') {
  try {
    const pdfjs = await import('./assets/pdfjs/pdf.min.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = './assets/pdfjs/pdf.worker.min.mjs';
    const pdf = await pdfjs.getDocument({url: './assets/Safaiat_cv.pdf', disableFontFace: false}).promise;
    const pages = [];
    for (let number = 1; number <= pdf.numPages; number++) pages.push(await pdf.getPage(number));
    let rendering = false, previousWidth = 0;
    async function render() {
      const width = Math.round(host.clientWidth);
      if (rendering || !width || width === previousWidth) return;
      rendering = true;
      try {
        const fragment = document.createDocumentFragment();
        for (const [index, page] of pages.entries()) {
          const section = document.createElement('div');
          section.className = 'cv-sheet';
          const canvas = document.createElement('canvas');
          canvas.setAttribute('aria-hidden', 'true');
          const scale = width / page.getViewport({scale: 1}).width;
          const viewport = page.getViewport({scale: scale * Math.min(devicePixelRatio || 1, 2)});
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
          const text = document.createElement('div');
          text.className = 'sr-only';
          text.textContent = 'CV page ' + (index + 1) + '. ' + (await page.getTextContent()).items.map(item => item.str).join(' ');
          section.append(canvas, text);
          fragment.append(section);
        }
        host.replaceChildren(fragment);
        previousWidth = width;
      } finally {
        rendering = false;
      }
    }
    await render();
    let timer;
    new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(() => render().catch(() => {}), 150); }).observe(host);
  } catch (error) {
    // The bundled page snapshots remain readable offline or if rendering fails.
    console.warn('CV preview unavailable; showing the bundled preview.', error);
  }
}
