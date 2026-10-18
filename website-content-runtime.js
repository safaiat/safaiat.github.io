/* Automatically refresh hosted content. file:// uses the embedded snapshot. */
(function(){
 'use strict';
 if(location.protocol!=='http:'&&location.protocol!=='https:')return;
 const esc=PortfolioData.escapeHTML;
 function renderRecords(records){
  publications=records;
  document.querySelector('#publication-list').innerHTML=records.map(PortfolioData.publicationHTML).join('');
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
   const cropped=['spect-panel','vendor-panel'].includes(r.crop);stage.classList.toggle('spect-example',cropped);
   stage.innerHTML=cropped?`<div class="spect-crop ${r.crop==='vendor-panel'?'vendor-panel':''}">${image}</div>`:image;
   const oldCaption=element.querySelector('figcaption').innerHTML;
   const img=stage.querySelector('img');img.addEventListener('error',()=>{stage.innerHTML=previous;stage.classList.toggle('spect-example',wasCropped);element.querySelector('figcaption').innerHTML=oldCaption},{once:true});
   const credit=r.credit_text?`<small>${r.credit_url?`<a href="${esc(r.credit_url)}" target="_blank" rel="noopener noreferrer">${esc(r.credit_text)} ↗</a>`:esc(r.credit_text)}${r.license_url?` · <a href="${esc(r.license_url)}">License</a>`:''}</small>`:'';
   element.querySelector('figcaption').innerHTML=`<strong>${esc(r.title)}</strong><span>${esc(r.caption)}</span>${credit}`;
  }));
 }
 function load(path,parse,apply){return fetch(path,{cache:'no-store'}).then(response=>{if(!response.ok)throw Error('HTTP '+response.status);return response.text()}).then(parse).then(apply).catch(error=>console.warn('Keeping embedded content for '+path+': '+error.message))}
 load('data/images.csv',PortfolioData.images,applyImages);
 if(document.querySelector('#publication-list'))load('data/publications.csv',PortfolioData.publications,renderRecords);
 if(document.querySelector('#home-publications'))load('data/publications.csv',PortfolioData.publications,records=>{document.querySelector('#home-publications').innerHTML=records.slice(0,3).map(PortfolioData.homePublicationHTML).join('')});
})();
