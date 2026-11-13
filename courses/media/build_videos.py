import json, os, subprocess, urllib.request, tempfile
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "videos")
os.makedirs(OUT, exist_ok=True)
manifest = json.load(open(os.path.join(ROOT, "manifest.json")))
for item in manifest:
    tmp = tempfile.mkdtemp()
    parts = []
    for i, url in enumerate(item["audio"]):
        p = os.path.join(tmp, f"part{i}.mp3")
        urllib.request.urlretrieve(url, p)
        parts.append(p)
    narr = os.path.join(tmp, "narr.mp3")
    if len(parts) == 1:
        narr = parts[0]
    else:
        lst = os.path.join(tmp, "list.txt")
        open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
        subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lst,"-c:a","libmp3lame","-b:a","128k",narr], check=True)
    img = os.path.join(ROOT, item["image"])
    out = os.path.join(OUT, item["id"] + ".mp4")
    vf = ("scale=1280:720:force_original_aspect_ratio=decrease,"
          "pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x0A0E16,"
          "fade=t=in:st=0:d=1,format=yuv420p")
    subprocess.run(["ffmpeg","-y","-loop","1","-i",img,"-i",narr,
        "-vf",vf,"-c:v","libx264","-tune","stillimage","-preset","medium","-crf","30",
        "-c:a","aac","-b:a","96k","-shortest","-movflags","+faststart",out], check=True)
    print("built", out, os.path.getsize(out))
