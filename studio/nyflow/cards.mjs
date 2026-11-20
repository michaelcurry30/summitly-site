import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
const jobs=JSON.parse(process.argv[2]);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('http://localhost:8766/nyflow/cards.html');await p.waitForFunction('window.READY');await p.evaluate("document.fonts.load('800 40px BS')");await p.evaluate("document.fonts.load('600 40px HG')");
for(const [out,js] of jobs){await p.evaluate(js);await p.locator('canvas').screenshot({path:out,omitBackground:true});console.log(out);}
await b.close();
