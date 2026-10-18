const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const api=require('./website-data.js');
const publicationCSV=fs.readFileSync('data/publications.csv','utf8'),imageCSV=fs.readFileSync('data/images.csv','utf8');
assert.equal(api.publications(publicationCSV).length,9);
assert.equal(api.images(imageCSV).length,5);
assert.deepEqual(api.parseCSV('\uFEFFa,b\r\n"one, two","line 1\nline ""2"""\r\n'),[{a:'one, two',b:'line 1\nline "2"'}]);
assert.throws(()=>api.parseCSV('a,b\n"unfinished,b'));
assert.throws(()=>api.parseCSV('a,b\n1,2,3'));
assert.throws(()=>api.publications(publicationCSV.replace('https://arxiv.org/abs/2607.13204','javascript:alert(1)')));
assert.throws(()=>api.images(imageCSV.replace('assets/profile.png','assets/../private.png')));
const records=api.publications(publicationCSV);for(const p of records)if(p.image)assert(fs.existsSync(p.image));
for(const r of api.images(imageCSV))assert(fs.existsSync(r.src));
const headers=api.parseCSV(publicationCSV);const keys=Object.keys(headers[0]);
const extra={...headers[0],id:'new-paper',year:'2027',title:'New <img src=x onerror=alert(1)> paper, with commas',description:'A "quoted" description.',image:'assets/profile.png',image_alt:'Publication illustration'};
const toCSV=rows=>[keys,...rows.map(row=>keys.map(key=>row[key]||''))].map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n');
const newerCSV=toCSV([...headers,extra]);
const html=fs.readFileSync('publications.html','utf8');
const script=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].find(m=>!m[0].includes('application/ld+json'))[1];
async function run(protocol,fail){
 let articles=[],publicationHTML='',fetched=[];
 const dummy={hidden:false,src:'',alt:'',classList:{toggle(){},contains(){return false},remove(){}},setAttribute(){},addEventListener(){},focus(){}};
 const nodes={};
 for(const name of ['#menu','#navigation','.back-top','#year','#pub-count','#no-results','#pub-search'])nodes[name]={...dummy,value:''};
 nodes['#publication-list']={set innerHTML(value){publicationHTML=value;articles=[...value.matchAll(/id="pub-([^"]+)"/g)].map(m=>({hidden:false,id:m[1]}))}};
 const filters=['all','conference','chapter','poster'].map(filter=>({...dummy,dataset:{filter}}));
 const profile={...dummy,tagName:'IMG'};
 let stageHTML='',captionHTML='';
 const stage={classList:dummy.classList,set innerHTML(value){stageHTML=value},querySelector(){return dummy}};
 const figure={tagName:'FIGURE',querySelector(selector){return selector==='.research-image'?stage:{set innerHTML(value){captionHTML=value}}}};
 const document={querySelector:selector=>nodes[selector],querySelectorAll(selector){if(selector==='.filter')return filters;if(selector==='.publication')return articles;if(selector.includes('data-image-key="profile"'))return [profile];if(selector.includes('data-image-key="hpc"'))return [figure];return []},getElementById(){return null},addEventListener(){}};
 const context=vm.createContext({document,location:{protocol,hash:''},scrollY:0,addEventListener(){},requestAnimationFrame:fn=>fn(),console:{warn(){}},fetch:async(path,options)=>{fetched.push(path);assert.equal(options.cache,'no-store');if(fail)throw Error('Offline');return {ok:true,text:async()=>path.includes('publications')?newerCSV:imageCSV}}});
 vm.runInContext(script,context);
 await new Promise(resolve=>setImmediate(resolve));
 if(protocol==='file:'){assert.equal(fetched.length,0);assert.equal(articles.length,9)}
 else if(fail){assert.equal(articles.length,9)}
 else{
  assert.equal(fetched.length,2);assert.equal(articles.length,10);assert.equal(articles[0].id,'new-paper');
  assert(publicationHTML.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert(!publicationHTML.includes('<img src=x onerror='));
  assert(publicationHTML.includes('class="publication-image"'));
  assert.equal(profile.src,'assets/profile.png');assert(stageHTML.includes('research-gpu-regions.png'));assert(captionHTML.includes('Different regions'));
  nodes['#pub-search'].value='New <img';vm.runInContext('filterPublications()',context);assert.equal(articles.filter(a=>!a.hidden).length,1);
 }
}
(async()=>{await run('file:',false);await run('https:',false);await run('https:',true);console.log('PASS: CSV quoting/BOM/multiline fields, validation, image paths, hosted automatic updates, new publication/image rendering, escaping, search after refresh, offline fallback, and failed-request fallback.');})().catch(error=>{console.error(error);process.exitCode=1});
