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
  rows.forEach(r=>{if(!['title','authors','venue','type'].every(k=>r[k])||!/^\d{4}$/.test(r.year)||!['conference','chapter','poster'].includes(r.category)||!webURL(r.url))throw Error('Invalid publication record');if(r.image&&!localImage(r.image))throw Error('Image must be a relative assets/ path');r.year=Number(r.year)});
  return unique(rows,'id').sort((a,b)=>b.year-a.year);
 }
 function images(text){
  const rows=unique(parseCSV(text),'key');
  rows.forEach(r=>{if(!localImage(r.src)||!r.alt)throw Error('Image requires local assets/ path and alt text');if(r.credit_url&&!webURL(r.credit_url))throw Error('Invalid credit URL');if(r.license_url&&!webURL(r.license_url)&&!localImage(r.license_url))throw Error('Invalid license URL');if(r.crop&&!['spect-panel','none'].includes(r.crop))throw Error('Invalid crop')});return rows;
 }
 function escapeHTML(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 const api={parseCSV,publications,images,escapeHTML,localImage};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PortfolioData=api;
})(globalThis);
