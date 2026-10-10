from PIL import Image,ImageDraw
from pathlib import Path
import numpy as np,json
vertices=[[-1,-1,1,-1,1,1,1,1,1,1,-1,1],[1,-1,1,1,1,1,1,1,-1,1,-1,-1],[1,-1,-1,1,1,-1,-1,1,-1,-1,-1,-1],[-1,-1,-1,-1,1,-1,-1,1,1,-1,-1,1],[-1,-1,-1,-1,-1,1,1,-1,1,1,-1,-1],[-1,1,1,-1,1,-1,1,1,-1,1,1,1]]
uv=[(0,0),(0,1),(1,1),(1,0)]
edges={}
for face,vs in enumerate(vertices):
    pts=[tuple(vs[i:i+3]) for i in range(0,12,3)]
    im=np.asarray(Image.open(f'public/assets/panorama/panorama_{face}.png').convert('RGB'))
    for i in range(4):
        j=(i+1)%4;a,b=pts[i],pts[j];u,v=uv[i],uv[j]
        if a>b:a,b,u,v=b,a,v,u
        t=np.linspace(0,1,256);xs=np.rint((u[0]*(1-t)+v[0]*t)*(im.shape[1]-1)).astype(int);ys=np.rint((u[1]*(1-t)+v[1]*t)*(im.shape[0]-1)).astype(int)
        edges.setdefault((a,b),[]).append((face,im[ys,xs].astype(float)))
report=[]
for key,pairs in edges.items():
    assert len(pairs)==2
    delta=np.abs(pairs[0][1]-pairs[1][1]);report.append({'faces':[pairs[0][0],pairs[1][0]],'edge':key,'meanRgbAbsoluteDifference':float(delta.mean()),'p95RgbDifference':float(np.quantile(delta,.95))})
Path('tests/seam-results.json').write_text(json.dumps(report,indent=2),encoding='utf8')
files=sorted(Path('tests/screenshots/panorama').glob('yaw-*.png'),key=lambda p:int(p.stem.split('-')[-1]))
out=Image.new('RGB',(1280,400));draw=ImageDraw.Draw(out)
for i,p in enumerate(files):out.paste(Image.open(p).resize((320,180)),((i%4)*320,(i//4)*200));draw.text(((i%4)*320+5,(i//4)*200+185),p.stem,fill='white')
out.save('tests/screenshots/panorama-sweep.jpg')
print(json.dumps({'edges':len(report),'meanEdgeRgbDifference':sum(r['meanRgbAbsoluteDifference'] for r in report)/len(report)},indent=2))
