import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/applications/blog/post`;
  const checks=[]; const failures=[]; let chrome; let cdp;
  const check=(name,passed,details)=>{checks.push({name,status:passed?'PASS':'FAIL',details});if(!passed)failures.push(name);};
  const shot=async(name)=>{const r=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});writeFileSync(join(artifactDir,name),Buffer.from(r.data,'base64'));};
  mkdirSync(artifactDir,{recursive:true});
  try {
    const response=await fetch(targetUrl); check('Deep link responds successfully',response.ok,{status:response.status});
    chrome=await launchChrome(); cdp=await connectCdp(chrome.webSocketDebuggerUrl); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
    await setViewport(cdp,{width:1365,height:768}); await navigate(cdp,targetUrl); await waitFor(cdp,`document.querySelectorAll('article').length===1`);
    const desktop=await evaluate(cdp,`({title:document.querySelector('article h1')?.textContent,headings:document.querySelectorAll('article h2').length,quotes:document.querySelectorAll('article blockquote').length,overflow:document.documentElement.scrollWidth>innerWidth,sidebar:Boolean(document.querySelector('aside'))})`);
    check('Canonical article title renders',desktop.title==='Diseñar productos que crecen sin perder claridad',desktop); check('Structured headings render',desktop.headings===2,desktop); check('Structured quote renders',desktop.quotes===1,desktop); check('Template shell remains present',desktop.sidebar,desktop); check('Desktop has no horizontal overflow',!desktop.overflow,desktop); await shot('blog-post-desktop.png');
    await setViewport(cdp,{width:390,height:844,mobile:true}); await navigate(cdp,targetUrl); await waitFor(cdp,`document.querySelectorAll('article').length===1`);
    const mobile=await evaluate(cdp,`({overflow:document.documentElement.scrollWidth>innerWidth,title:document.querySelector('article h1')?.textContent})`); check('Mobile keeps article title',mobile.title==='Diseñar productos que crecen sin perder claridad',mobile); check('Mobile has no horizontal overflow',!mobile.overflow,mobile); await shot('blog-post-mobile.png');
  } catch(error){check('Browser scenario completes without runtime exception',false,{error:String(error.stack??error)});}
  finally{cdp?.close();await chrome?.stop();writeFileSync(join(artifactDir,'report.json'),JSON.stringify({schemaVersion:'1.0',view:'applications.blog-post',targetUrl,generatedAt:new Date().toISOString(),status:failures.length?'FAIL':'PASS',checks,failures},null,2));}
  if(failures.length)throw new Error(`Blog Post browser QA failed: ${failures.join('; ')}`);
}
