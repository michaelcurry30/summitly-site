import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
const [ep,out]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8766/bhc/index.html?ep='+ep);await p.waitForFunction('window.READY');
const dur=await p.evaluate('window.EP.dur');const N=Math.ceil(dur*30);
const ff=spawn('ffmpeg',['-y','-nostdin','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',out],{stdio:['pipe','ignore','inherit']});
for(let i=0;i<N;i++){await p.evaluate(`window.render(${i/30})`);const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));console.log('frames',N);await b.close();
