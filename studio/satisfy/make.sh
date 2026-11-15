# full build of one Satisfy Lab episode: bash make.sh <spec.json>   (needs: python3 -m http.server 8766 in studio/)
set -e; cd /home/claude/summitly-site/studio/satisfy; SPEC=$1; ID=$(python3 -c "import json;print(json.load(open('$SPEC'))['id'])")
N=$(python3 -c "import json;print(len(json.load(open('$SPEC'))['rounds']))")
for i in $(seq 0 $((N-1))); do python3 sim2.py $SPEC $i 2>&1 | tail -1; done
mkdir -p out; node rend.mjs $SPEC out/${ID}_v.mp4
python3 sound.py $SPEC out/${ID}.wav
ffmpeg -nostdin -v error -y -i out/${ID}_v.mp4 -i out/${ID}.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart out/${ID}.mp4
echo BUILT out/${ID}.mp4
