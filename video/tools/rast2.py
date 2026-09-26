import pymupdf,sys,os,glob,numpy as np
from PIL import Image
src,out,dpi=sys.argv[1],sys.argv[2],int(sys.argv[3]); os.makedirs(out,exist_ok=True)
for f in sorted(glob.glob(src+"/*.pdf")):
    d=pymupdf.open(f); n=os.path.basename(f)[:-4]; p=d[0]
    pix=p.get_pixmap(dpi=dpi); im=Image.frombytes("RGB",(pix.width,pix.height),pix.samples)
    a=np.asarray(im).astype(int); nonw=np.where((a<248).any(axis=2))
    y0,y1,x0,x1=nonw[0].min(),nonw[0].max(),nonw[1].min(),nonw[1].max()
    im=im.crop((x0,y0,x1+1,y1+1)); im.save(f"{out}/{n}.png"); print(n,im.size,len(d))
