module.exports = function graphic(index) {
 const figures = [
  ['pytomography-spect-example.png','SPECT reconstruction','Reconstructed phantom from the official PyTomography SPECT tutorial, shown alongside its vendor comparison.','Official PyTomography tutorial figure comparing a PyTomography SPECT reconstruction with Siemens software'],
  ['research-phantom-projection.png','CT: image & projection space','Modified Shepp–Logan phantom with its analytic parallel-beam sinogram.','CT illustration with a modified Shepp–Logan phantom and its parallel-beam sinogram'],
  ['research-gpu-regions.png','Different regions. Different GPUs.','A conceptual illustration of separate image regions assigned to individual GPUs.','A phantom divided into four horizontal image regions, each connected to a different GPU'],
  ['research-priors-detail.png','From image quality to fine detail','Blurred and reference phantom views, with an enlarged region to illustrate the role of image priors.','Illustrative blurred phantom, clear reference phantom, and enlarged internal structure; not a model result']
 ];
 const [file,title,caption,alt] = figures[index];
 const credit=index===0?'<small>Source: <a href="https://pytomography.readthedocs.io/en/latest/notebooks/t_dicomdata.html#reconstruct-the-object" target="_blank" rel="noopener noreferrer">PyTomography documentation ↗</a> · © Luke Polson · <a href="assets/PyTomography-LICENSE.txt">MIT license</a>. External example; not my research result.</small>':'<small>Conceptual illustration · not an experimental or learned-model result</small>';
 return `<figure class="research-visual"><div class="research-image ${index===0?'spect-example':''}"><img src="assets/${file}" width="${index===0?562:1200}" height="${index===0?251:680}" alt="${alt}" loading="lazy" decoding="async"></div><figcaption><strong>${title}</strong><span>${caption}</span>${credit}</figcaption></figure>`;
};
