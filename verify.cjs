const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const pages=['index.html','about.html','research.html','publications.html','experience.html','contact.html'];
const sources=Object.fromEntries(pages.map(p=>[p,fs.readFileSync(p,'utf8')]));
const generatedIds={};
for(const file of pages){
 const html=sources[file];
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size,'Duplicate IDs in '+file);
 generatedIds[file]=new Set(ids);
 assert(!/<script[^>]+src=|<link[^>]+stylesheet|\bimport\s*\(/.test(html));
 if(['index.html','about.html','research.html','publications.html'].includes(file))assert(html.includes("if(location.protocol!=='http:'&&location.protocol!=='https:')return;"));
 if(file!=='index.html')assert(!html.includes('<div class="eyebrow">Md Safaiat Hossain</div>'));
 if(file==='research.html')assert.equal((html.match(/class="project"/g)||[]).length,7);
 assert(html.includes('@media(max-width:560px)')&&html.includes('@media(max-width:760px)'));
 assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
 JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 const script=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].find(x=>!x[0].includes('application/ld+json'))[1];
 new vm.Script(script);
 let articles=[];
 function el(name){return {value:'',hidden:false,textContent:'',classList:{toggle(){return true},remove(){},contains(){return false}},setAttribute(){},addEventListener(){},focus(){},set innerHTML(value){if(name==='#publication-list'){articles=[...value.matchAll(/id="pub-([^"]+)"/g)].map(x=>({hidden:false,id:'pub-'+x[1]}));articles.forEach(x=>generatedIds[file].add(x.id))}if(name==='#projects-grid')assert.equal((value.match(/<article/g)||[]).length,7)}}}
 const nodes=Object.fromEntries(['#menu','#navigation','.back-top','#year','#publication-list','#projects-grid','#pub-search','#pub-count','#no-results'].map(s=>[s,el(s)]));
 const filters=['all','conference','chapter','poster'].map(filter=>({...el(filter),dataset:{filter}}));
 const document={querySelector:s=>nodes[s],querySelectorAll:s=>s==='.filter'?filters:articles,addEventListener(){},getElementById(){return null}};
 const context=vm.createContext({document,location:{hash:''},scrollY:0,addEventListener(){},requestAnimationFrame:cb=>cb(),console});
 vm.runInContext(script,context);
 if(file==='publications.html'){
  assert.equal(articles.length,9);
  const check=(cat,query,count)=>{vm.runInContext(`category='${cat}'`,context);nodes['#pub-search'].value=query;vm.runInContext('filterPublications()',context);assert.equal(articles.filter(x=>!x.hidden).length,count);assert.equal(nodes['#no-results'].hidden,count>0)};
  check('all','',9);check('conference','',6);check('chapter','',2);check('poster','',1);check('all','sTyLeGaN2',1);check('conference','2023',4);check('all','impossible query',0);check('all','',9);
 }
 console.log('PASS '+file+': script execution, offline dependencies, responsive rules, structured metadata, active navigation.');
}
for(const file of pages){for(const match of sources[file].replace(/<script[\s\S]*?<\/script>/g,'').matchAll(/(?:href|src)="([^"]+)"/g)){
 const url=match[1];if(/^(https?:|mailto:)/.test(url)||url.startsWith('assets/Md_'))continue;
 const [target,hash]=url.split('#');const path=target||file;
 assert(fs.existsSync(path),'Missing resource '+url+' in '+file);
 if(hash)assert(generatedIds[path]?.has(hash),'Missing anchor '+url+' in '+file);
}}
console.log('PASS: all internal page/resource/anchor links, seven projects, nine scholarly outputs, and eight search/filter scenarios.');
console.log('Visual viewport checks require a browser; automated file-URL access is unavailable.');
