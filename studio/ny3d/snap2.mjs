import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
const [url,out,times]=process.argv.slice(2);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1600,height:900}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log(m.text()));
await p.goto('http://localhost:8766/ny3d/'+url);await p.waitForFunction('window.READY',null,{timeout:180000});
for(const t of times.split(',')){await p.evaluate(`window.go(${t})`);await p.screenshot({path:`${out}_${t}.jpg`,type:'jpeg',quality:80});}
await b.close();
