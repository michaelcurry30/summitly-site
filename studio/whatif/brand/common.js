// draws a simple city skyline silhouette into a canvas element
function skyline(cv,seed,cols,base){const g=cv.getContext('2d');let s=seed;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  const W=cv.width,H=cv.height;for(const [col,hmin,hmax,wmin] of cols){let x=-20;g.fillStyle=col;
   while(x<W){const w=wmin+r()*wmin*1.2,h=hmin+r()*(hmax-hmin);g.fillRect(x,H-base-h,w,h+base);
     g.fillStyle='rgba(255,236,170,.55)';for(let yy=H-base-h+14;yy<H-base-10;yy+=26)for(let xx=x+10;xx<x+w-12;xx+=22)if(r()<.18)g.fillRect(xx,yy,9,12);g.fillStyle=col;x+=w+4;}}}
