v=$1;T=$(python3 -c "import json;print(json.load(open('t/$v.json'))['total'])")
ffmpeg -y -loglevel error -framerate 30 -i fr/$v/%04d.jpg -i vo/$v.wav -stream_loop -1 -i /home/claude/ra/music.wav \
 -filter_complex "[2:a]volume=0.18,afade=t=out:st=$(python3 -c "print($T-1.2)"):d=1.2[m];[1:a]aresample=44100,pan=stereo|c0=c0|c1=c0[v];[v][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]" \
 -map 0:v -map "[a]" -t $T -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart out/$v.tmp.mp4 && mv out/$v.tmp.mp4 out/$v.mp4 && echo muxed $v
