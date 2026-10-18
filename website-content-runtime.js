/* Automatically refresh hosted content. file:// uses the embedded snapshot. */
(function(){
 'use strict';
 if(location.protocol!=='http:'&&location.protocol!=='https:')return;
 const esc=PortfolioData.escapeHTML;
 function renderRecords(records){
  publications=records;
  document.querySelector('#publication-list').innerHTML=records.map(p=>{
   const image=p.image?`<img class="publication-image" src="${esc(p.image)}" alt="${esc(p.image_alt||p.title)}" loading="lazy">`:'';
   return `<article class="publication" id="pub-${esc(p.id)}"><div class="pub-year">${p.year}</div><div><h3><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a></h3><p class="authors">${esc(p.authors).replace(/Md\.? Safaiat Hossain/g,'<strong>$&</strong>')}</p><p class="venue">${esc(p.venue)}</p><p class="pub-type">${esc(p.type)}</p>${p.description?`<p class="pub-description">${esc(p.description)}</p>`:''}${image}</div><a class="pub-link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Read ${esc(p.title)}">Read ↗</a></article>`;
  }).join('');
  document.querySelectorAll('.publication-image').forEach(img=>img.addEventListener('error',()=>{img.hidden=true}));
  filterPublications();
  if(location.hash){const target=document.getElementById(location.hash.slice(1));if(target)requestAnimationFrame(()=>target.scrollIntoView())}
 }
 function applyImages(records){
  records.forEach(r=>document.querySelectorAll('[data-image-key="'+r.key+'"]').forEach(element=>{
   if(element.tagName==='IMG'){const oldSource=element.src,oldAlt=element.alt;element.addEventListener('error',()=>{element.src=oldSource;element.alt=oldAlt},{once:true});element.src=r.src;element.alt=r.alt;return}
   const stage=element.querySelector('.research-image');if(!stage)return;
   const previous=stage.innerHTML,wasCropped=stage.classList.contains('spect-example');
   const image=`<img src="${esc(r.src)}" width="1200" height="680" alt="${esc(r.alt)}" loading="lazy" decoding="async">`;
   const cropped=r.crop==='spect-panel';stage.classList.toggle('spect-example',cropped);
   stage.innerHTML=cropped?`<div class="spect-crop">${image}</div>`:image;
   const oldCaption=element.querySelector('figcaption').innerHTML;
   const img=stage.querySelector('img');img.addEventListener('error',()=>{stage.innerHTML=previous;stage.classList.toggle('spect-example',wasCropped);element.querySelector('figcaption').innerHTML=oldCaption},{once:true});
   const credit=r.credit_text?`<small>${r.credit_url?`<a href="${esc(r.credit_url)}" target="_blank" rel="noopener noreferrer">${esc(r.credit_text)} ↗</a>`:esc(r.credit_text)}${r.license_url?` · <a href="${esc(r.license_url)}">License</a>`:''}</small>`:'';
   element.querySelector('figcaption').innerHTML=`<strong>${esc(r.title)}</strong><span>${esc(r.caption)}</span>${credit}`;
  }));
 }
 function load(path,parse,apply){return fetch(path,{cache:'no-store'}).then(response=>{if(!response.ok)throw Error('HTTP '+response.status);return response.text()}).then(parse).then(apply).catch(error=>console.warn('Keeping embedded content for '+path+': '+error.message))}
 load('data/images.csv',PortfolioData.images,applyImages);
 if(document.querySelector('#publication-list'))load('data/publications.csv',PortfolioData.publications,renderRecords);
})();
