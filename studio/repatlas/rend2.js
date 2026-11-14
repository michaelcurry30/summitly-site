const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [ex,tlp,n,out]=process.argv.slice(2);const TL=fs.readFileSync(tlp,'utf8');
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/ex.html?ex='+ex);await p.waitForFunction('window.READY',null,{timeout:90000});await p.evaluate('document.fonts.ready');
await p.evaluate(`window.TL=${TL}`);fs.mkdirSync(out,{recursive:true});
for(let i=0;i<+n;i++){const f=`${out}/${String(i).padStart(4,'0')}.jpg`;if(fs.existsSync(f))continue;await p.evaluate(`window.render(${i/30})`);await p.screenshot({path:f+'.tmp.jpg',type:'jpeg',quality:90});fs.renameSync(f+'.tmp.jpg',f);}
await b.close()})()
