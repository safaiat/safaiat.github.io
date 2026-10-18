module.exports = function graphic(index) {
 const figures = [
  ['pytomography-spect-example.png','SPECT reconstruction','Reconstructed phantom from the official PyTomography SPECT tutorial.','PyTomography SPECT phantom reconstruction, cropped from the official tutorial figure'],
  ['research-phantom-projection.png','CT: image & projection space','Modified Shepp–Logan phantom with its analytic parallel-beam sinogram.','CT illustration with a modified Shepp–Logan phantom and its parallel-beam sinogram'],
  ['research-gpu-regions.png','Different regions. Different GPUs.','A conceptual illustration of separate image regions assigned to individual GPUs.','A phantom divided into four horizontal image regions, each connected to a different GPU'],
  ['research-priors-detail.png','From image quality to fine detail','Blurred and reference phantom views, with an enlarged region to illustrate the role of image priors.','Illustrative blurred phantom, clear reference phantom, and enlarged internal structure; not a model result']
 ];
 const fs=require('fs'),config=require('./website-data.js'),esc=config.escapeHTML;
 const key=['spect','ct','hpc','priors'][index];
 const row=config.images(fs.readFileSync('data/images.csv','utf8')).find(row=>row.key===key);
 let [file,title,caption,alt] = figures[index];
 if(row){file=row.src.slice(7);title=row.title;caption=row.caption;alt=row.alt}
 const cropped=row?['spect-panel','vendor-panel'].includes(row.crop):index===0;
 const credit=row?(row.credit_text?`<small>${row.credit_url?`<a href="${esc(row.credit_url)}" target="_blank" rel="noopener noreferrer">${esc(row.credit_text)} ↗</a>`:esc(row.credit_text)}${row.license_url?` · <a href="${esc(row.license_url)}">License</a>`:''}</small>`:''):'<small>Conceptual illustration</small>';
 const image=`<img src="assets/${esc(file)}" width="${cropped?562:1200}" height="${cropped?251:680}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
 return `<figure class="research-visual" data-image-key="${key}"><div class="research-image ${cropped?'spect-example':''}">${cropped?`<div class="spect-crop ${row?.crop==='vendor-panel'?'vendor-panel':''}">${image}</div>`:image}</div><figcaption><strong>${esc(title)}</strong><span>${esc(caption)}</span>${credit}</figcaption></figure>`;
};
