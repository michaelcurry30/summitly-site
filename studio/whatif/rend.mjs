// node rend.mjs <ep> <out.mp4|x> [stills t1,t2,...]
import { chromium } from '/home/claude/summitly-site/studio/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
const [ep,out,stills]=process.argv.slice(2);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CERR',m.text())});
await p.goto('http://localhost:8766/whatif/index.html?ep='+ep);await p.waitForFunction('window.READY',null,{timeout:180000});
if(stills){for(const t of stills.split(',')){await p.evaluate(`window.render(${t})`);await p.screenshot({path:`/tmp/wi_${t}.jpg`,type:'jpeg',quality:85});}console.log('stills');await b.close();process.exit(0);}
const N=Math.ceil(await p.evaluate('window.EP.dur')*30);
const ff=spawn('ffmpeg',['-y','-nostdin','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p',out],{stdio:['pipe','ignore','inherit']});
const t0=Date.now();
for(let i=0;i<N;i++){await p.evaluate(`window.render(${i/30})`);const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i==10)console.log('s/frame',((Date.now()-t0)/11000).toFixed(2));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));console.log('frames',N);await b.close();
