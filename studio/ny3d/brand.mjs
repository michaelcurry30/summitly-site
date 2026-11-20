import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
const jobs=JSON.parse(process.argv[2]);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const [out,qs] of jobs){const pfp=qs.includes('mode=pfp');const p=await b.newPage({viewport:{width:pfp?1080:2560,height:pfp?1080:1440}});p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('http://localhost:8766/ny3d/brand.html?'+qs);await p.waitForFunction('window.READY',null,{timeout:300000});await p.screenshot({path:out,type:'png'});await p.close();console.log(out);}
await b.close();
