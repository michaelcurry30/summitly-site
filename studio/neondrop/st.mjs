import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
const [v,...ts]=process.argv.slice(2);const b=await chromium.launch();
if(v==='art'){for(const m of ['banner','profile']){const p=await b.newPage({viewport:m==='banner'?{width:2560,height:1440}:{width:1080,height:1080}});await p.goto('http://localhost:8766/neondrop/index.html?mode='+m);await p.waitForFunction('window.READY');await p.screenshot({path:`out/${m}.jpg`,type:'jpeg',quality:92});}}
else{const p=await b.newPage({viewport:{width:1080,height:1920}});await p.goto('http://localhost:8766/neondrop/index.html?v='+v);await p.waitForFunction('window.READY');
for(const t of ts){await p.evaluate(`window.render(${t})`);await p.screenshot({path:`out/st_${v}_${t}.jpg`,type:'jpeg',quality:80});}}
await b.close();
