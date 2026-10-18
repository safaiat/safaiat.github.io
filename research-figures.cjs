module.exports = function graphic(index) {
 const figures = [
  ['research-phantom-projection.png','Phantom & projection space','Modified Shepp–Logan phantom and its analytic parallel-beam sinogram.','Modified Shepp–Logan phantom on the left and an analytic parallel-beam sinogram on the right'],
  ['research-phantom-priors.png','Image structure & synthetic noise','Synthetic noise perturbation beside the reference phantom. No model output is shown.','A synthetic noisy phantom on the left and the reference phantom on the right; not a denoising result'],
  ['research-phantom-partitions.png','A shared image. Distributed computation.','Spatial partition illustration using a single digital phantom.','A modified Shepp–Logan phantom divided into a four-by-four spatial grid; conceptual computation partitions'],
  ['research-phantom-multiscale.png','Structure across scales','Full phantom and magnified regions. No learned features or model predictions are shown.','Modified Shepp–Logan phantom with two enlarged regions showing internal structures']
 ];
 const [file,title,caption,alt] = figures[index];
 return `<figure class="research-visual"><div class="research-image"><img src="assets/${file}" width="1200" height="680" alt="${alt}" loading="lazy" decoding="async"></div><figcaption><strong>${title}</strong><span>${caption}</span><small>Illustrative digital phantom · not experimental findings</small></figcaption></figure>`;
};
