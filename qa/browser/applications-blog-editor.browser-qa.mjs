import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl=`${baseUrl.replace(/\/$/,'')}/applications/blog/editor`; const checks=[]; const failures=[]; let chrome; let cdp;
  const check=(name,passed,details)=>{checks.push({name,status:passed?'PASS':'FAIL',details});if(!passed)failures.push(name);};
  const shot=async(name)=>{const r=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});writeFileSync(join(artifactDir,name),Buffer.from(r.data,'base64'));};
  mkdirSync(artifactDir,{recursive:true});
  try {
    const response=await fetch(targetUrl); check('Deep link responds successfully',response.ok,{status:response.status});
    chrome=await launchChrome(); cdp=await connectCdp(chrome.webSocketDebuggerUrl); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
    await setViewport(cdp,{width:1365,height:768}); await navigate(cdp,targetUrl); await waitFor(cdp,`document.querySelector('#blog-editor-title')`);
    const initial=await evaluate(cdp,`({title:document.querySelector('#blog-editor-title')?.value,blocks:document.querySelectorAll('[id^="blog-editor-block-text-"]').length,articles:document.querySelectorAll('article').length,overflow:document.documentElement.scrollWidth>innerWidth,sidebar:Boolean(document.querySelector('aside'))})`);
    check('Canonical title loads',initial.title==='Diseñar productos que crecen sin perder claridad',initial); check('Structured blocks load',initial.blocks===7,initial); check('Live preview exists',initial.articles===1,initial); check('Template shell remains present',initial.sidebar,initial); check('Desktop has no horizontal overflow',!initial.overflow,initial);
    await evaluate(cdp,`(()=>{const input=document.querySelector('#blog-editor-title');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,'Título editado en vivo');input.dispatchEvent(new Event('input',{bubbles:true}));})()`); await waitFor(cdp,`document.querySelector('article h2')?.textContent==='Título editado en vivo'`); check('Controlled title updates live preview',true,{}); await shot('blog-editor-desktop.png');
    await setViewport(cdp,{width:390,height:844,mobile:true}); await navigate(cdp,targetUrl); await waitFor(cdp,`document.querySelector('#blog-editor-title')`); const mobile=await evaluate(cdp,`({overflow:document.documentElement.scrollWidth>innerWidth,blocks:document.querySelectorAll('[id^="blog-editor-block-text-"]').length})`); check('Mobile keeps all blocks',mobile.blocks===7,mobile); check('Mobile has no horizontal overflow',!mobile.overflow,mobile); await shot('blog-editor-mobile.png');
  } catch(error){check('Browser scenario completes without infrastructure/runtime exception',false,{error:String(error.stack??error)});}
  finally{cdp?.close();await chrome?.stop();writeFileSync(join(artifactDir,'report.json'),JSON.stringify({schemaVersion:'1.0',view:'applications.blog-editor',targetUrl,generatedAt:new Date().toISOString(),status:failures.length?'FAIL':'PASS',checks,failures},null,2));}
  if(failures.length) throw new Error(`Blog Editor browser QA failed: ${failures.join('; ')}`);
}
