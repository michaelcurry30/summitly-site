#!/usr/bin/env python3
"""Render a 1000x1500 checklist infographic pin (planner style) to PNG.

Usage: python3 studio/pinmaker/make_pin.py spec.json out.png
spec.json: {"kicker":"HABITS","title":"7 tiny habits that change your life",
            "items":["Make your bed", ...] (3-8 items),
            "footer":"Free habit tracker + Daily Habit Builder",
            "color":"#2f6b50"}   # optional header color
"""
import json, sys, html, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1] / "kit" / "fonts"
spec = json.load(open(sys.argv[1]))
out = sys.argv[2]
col = spec.get("color", "#2f6b50")
items = spec["items"]
rowh = min(106, int(800 / len(items)))
rows = "".join(
    f'<div class="r" style="height:{rowh}px"><span class="n">{i+1}</span><span>{html.escape(t)}</span></div>'
    for i, t in enumerate(items))
page = f"""<html><head><meta charset="utf-8"><style>
@font-face{{font-family:BS;src:url(file://{ROOT}/big-shoulders-display-latin-800-normal.woff2)}}
@font-face{{font-family:HG;src:url(file://{ROOT}/hanken-grotesk-latin-600-normal.woff2)}}
@font-face{{font-family:PM;src:url(file://{ROOT}/ibm-plex-mono-latin-400-normal.woff2)}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1000px;height:1500px;background:#f3efe6;font-family:HG;color:#1d1d1b}}
.card{{position:absolute;left:40px;top:40px;width:920px;height:1420px;background:#fdfcf8;border-radius:40px;overflow:hidden}}
.hd{{background:{col};color:#fff;padding:78px 70px 60px}}
.k{{font-family:PM;font-size:26px;letter-spacing:9px;opacity:.85;text-transform:uppercase}}
.t{{font-family:BS;font-size:104px;line-height:.92;text-transform:uppercase;margin-top:18px}}
.ls{{padding:40px 70px 0}}
.r{{display:flex;align-items:center;gap:28px;border-bottom:2px solid #ebe7dd;font-size:38px}}
.n{{flex:none;width:64px;height:64px;border-radius:50%;background:{col};color:#fff;font-family:BS;font-size:40px;display:flex;align-items:center;justify-content:center}}
.ft{{position:absolute;left:0;right:0;bottom:0;padding:34px 70px 44px;border-top:2px dashed #ddd6c6;background:#f6f2e9}}
.ft .a{{font-size:34px}} .ft .b{{font-family:PM;font-size:28px;color:{col};margin-top:10px}}
</style></head><body><div class="card">
<div class="hd"><div class="k">{html.escape(spec.get('kicker','HABITS'))}</div><div class="t">{html.escape(spec['title'])}</div></div>
<div class="ls">{rows}</div>
<div class="ft"><div class="a">📒 {html.escape(spec['footer'])}</div><div class="b">changinghabits4good.gumroad.com</div></div>
</div></body></html>"""
tmp = pathlib.Path(out).with_suffix(".html")
tmp.write_text(page)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1000, "height": 1500})
    pg.goto(f"file://{tmp.resolve()}")
    pg.wait_for_timeout(600)
    pg.screenshot(path=out)
    b.close()
tmp.unlink()
print("wrote", out)
