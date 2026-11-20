import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
const [page,times,out]=process.argv.slice(2);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8766/nytoon/'+page);await p.waitForFunction('window.READY',null,{timeout:60000});
if(times!=='render'){for(const t of times.split(',')){await p.evaluate(`window.render(${t})`);await p.screenshot({path:`/tmp/nt_${t}.jpg`,type:'jpeg',quality:80});}await b.close();process.exit(0);}
const N=Math.ceil(await p.evaluate('window.EP.dur')*30);
const ff=spawn('ffmpeg',['-y','-nostdin','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p',out],{stdio:['pipe','ignore','inherit']});
for(let i=0;i<N;i++){await p.evaluate(`window.render(${i/30})`);const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));console.log('frames',N);await b.close();
