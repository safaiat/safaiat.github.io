/* CSV content utilities shared by the build and the embedded browser code. */
(function(root){
 'use strict';
 function parseCSV(text){
  text=String(text).replace(/^\uFEFF/,'');
  const rows=[];let row=[],cell='',quoted=false,closed=false;
  for(let i=0;i<text.length;i++){
   const c=text[i];
   if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++}else{quoted=false;closed=true}}else cell+=c;continue}
   if(c==='"'){if(cell||closed)throw Error('Unexpected quote in CSV');quoted=true;continue}
   if(c===','||c==='\n'||c==='\r'){
    row.push(cell);cell='';closed=false;
    if(c!==','){if(c==='\r'&&text[i+1]==='\n')i++;if(row.some(v=>v.trim()))rows.push(row);row=[]}continue;
   }
   if(closed){if(c===' '||c==='\t')continue;throw Error('Unexpected text after closing quote')}
   cell+=c;
  }
  if(quoted)throw Error('Unclosed CSV quote');
  row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
  if(!rows.length)throw Error('Empty CSV');
  const headers=rows.shift().map(v=>v.trim());
  if(new Set(headers).size!==headers.length||headers.some(v=>!v))throw Error('Invalid CSV headers');
  return rows.map((values,i)=>{if(values.length!==headers.length)throw Error('Wrong column count at row '+(i+2));return Object.fromEntries(headers.map((key,j)=>[key,values[j].trim()]))});
 }
 function localImage(path){return /^assets\//.test(path)&&!/[\\:#?<>\x00-\x1f]/.test(path)&&!path.split('/').some(part=>part==='..'||part==='.'||!part)}
 function webURL(url){return /^https?:\/\/[^\s<>]+$/i.test(url)}
 function unique(records,key){const seen=new Set();records.forEach(r=>{if(!/^[a-z][a-z0-9-]*$/.test(r[key])||seen.has(r[key]))throw Error('Invalid or duplicate '+key);seen.add(r[key])});return records}
 function publications(text){
  const rows=parseCSV(text);if(!rows.length)throw Error('No publication records');
  rows.forEach(r=>{if(!['title','authors','venue','type'].every(k=>r[k])||!/^\d{4}$/.test(r.year)||!['conference','chapter','poster'].includes(r.category)||!webURL(r.url))throw Error('Invalid publication record');if(r.image&&!localImage(r.image))throw Error('Image must be a relative assets/ path');if(r.pdf_url&&!webURL(r.pdf_url)&&!localImage(r.pdf_url))throw Error('PDF must be a web URL or relative assets/ path');r.year=Number(r.year)});
  return unique(rows,'id').sort((a,b)=>b.year-a.year);
 }
 function images(text){
  const rows=unique(parseCSV(text),'key');
  rows.forEach(r=>{if(!localImage(r.src)||!r.alt)throw Error('Image requires local assets/ path and alt text');if(r.credit_url&&!webURL(r.credit_url))throw Error('Invalid credit URL');if(r.license_url&&!webURL(r.license_url)&&!localImage(r.license_url))throw Error('Invalid license URL');if(r.crop&&!['spect-panel','none'].includes(r.crop))throw Error('Invalid crop')});return rows;
 }
 function escapeHTML(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 function publicationHTML(p){
  const esc=escapeHTML;
  return `<article class="publication" id="pub-${esc(p.id)}"><div class="publication-heading"><span class="pub-year">${p.year}</span><span class="pub-type">${esc(p.type)}</span></div><h3><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a></h3><p class="authors">${esc(p.authors).replace(/Md\.? Safaiat Hossain/g,'<strong>$&</strong>')}</p><p class="venue">${esc(p.venue)}</p>${p.description?`<p class="pub-description">${esc(p.description)}</p>`:''}${p.image?`<img class="publication-image" src="${esc(p.image)}" alt="${esc(p.image_alt||p.title)}" loading="lazy">`:''}<div class="pub-actions"><a class="publication-button" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Publication website for ${esc(p.title)}">Publication website <span aria-hidden="true">↗</span></a>${p.pdf_url?`<a class="publication-button pdf-button" href="${esc(p.pdf_url)}" target="_blank" rel="noopener noreferrer" aria-label="PDF of ${esc(p.title)}">PDF <span aria-hidden="true">↗</span></a>`:''}</div></article>`;
 }
 function homePublicationHTML(p){const esc=escapeHTML;return `<article class="home-publication"><div class="home-pub-year">${p.year}<span>${esc(p.type)}</span></div><div><h3><a href="publications.html#pub-${esc(p.id)}">${esc(p.title)}</a></h3><p>${esc(p.venue)}</p></div><a class="home-pub-link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Publication website for ${esc(p.title)}">↗</a></article>`}
 const api={parseCSV,publications,images,escapeHTML,localImage,publicationHTML,homePublicationHTML};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PortfolioData=api;
})(globalThis);
