import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
const [ep,...ts]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8766/bhc/index.html?ep='+ep);await p.waitForFunction('window.READY');
for(const t of ts){await p.evaluate(`window.render(${t})`);await p.screenshot({path:`/tmp/bhc_${t}.jpg`,type:'jpeg',quality:70});}
await b.close();
