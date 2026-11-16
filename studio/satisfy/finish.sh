# render + sound + mux for an already-simulated spec: bash finish.sh epNN
set -e; cd /home/claude/summitly-site/studio/satisfy; ID=$1
node rend.mjs $ID.json out/${ID}_v.mp4 2>&1 | grep -E "frames|ERR|s/frame"
python3 sound.py $ID.json out/$ID.wav
ffmpeg -nostdin -v error -y -i out/${ID}_v.mp4 -i out/$ID.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart out/$ID.mp4
cp out/$ID.mp4 ../../media/satisfy/$ID.mp4; echo BUILT $ID
