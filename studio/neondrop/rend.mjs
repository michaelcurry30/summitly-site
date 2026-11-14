import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
import fs from 'fs';
const ids=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const v of ids){const T=JSON.parse(fs.readFileSync(`t/${v}.json`));const N=Math.ceil(T.total*30);fs.mkdirSync(`fr/${v}`,{recursive:true});
 await p.goto('http://localhost:8766/neondrop/index.html?v='+v);await p.waitForFunction('window.READY');
 for(let i=0;i<N;i++){await p.evaluate(`window.render(${i/30})`);await p.screenshot({path:`fr/${v}/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:92});}
 console.log('frames',v,N);}
await b.close();
