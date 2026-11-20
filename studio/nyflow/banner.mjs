import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
const jobs=JSON.parse(process.argv[2]);const b=await chromium.launch();const p=await b.newPage({viewport:{width:2560,height:1440}});
await p.goto('http://localhost:8766/nyflow/banner.html');await p.waitForFunction('window.READY');await p.evaluate("Promise.all([document.fonts.load('800 40px BS'),document.fonts.load('600 40px HG')])");
for(const [out,o] of jobs){await p.goto('http://localhost:8766/nyflow/banner.html');await p.waitForFunction('window.READY');await p.evaluate("Promise.all([document.fonts.load('800 40px BS'),document.fonts.load('600 40px HG')])");await p.evaluate(o2=>window.make(o2),o);await p.locator('canvas').screenshot({path:out,type:'jpeg',quality:90});console.log(out);}
await b.close();
