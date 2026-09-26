import pymupdf,json,numpy as np
from PIL import Image
DPI=200; s=DPI/72
want={
 "trace_found":["BATCH NO.","JHS-26003","MATCHING RECORDS","STEP 2","PR-2026-00003","MATERIAL TRACEABILITY","HL-AMW-26-0061","Released","DN-26-00002","The same Batch No. is printed","PRODUCT INFORMATION","MACHINE & DISPATCH","Delivered"],
 "trace_empty":["BATCH NO.","MATCHING RECORDS"],
 "reverse":["DIRECTION 2","HL-AMW-26-0061","PRODUCTION RUNS AFFECTED","8,312","DIRECTION 1","PR-2026-00003","Perlon Nylon GmbH"],
 "dashboard_all":["BRAND / COMPANY","All Brands","OUTPUT & EFFICIENCY","OVERALL OEE","TRENDS & DISTRIBUTION","NEEDS ATTENTION"],
 "dashboard_chicco":["BRAND / COMPANY","Chicco","OUTPUT & EFFICIENCY"],
 "oee":["OEE HEADLINE","OEE ANALYSIS","MACHINE OEE DETAIL"],
 "master":["Production Run ID","MASTER TRACEABILITY"],
 "master_status":["Overall Traceability Status","Data Validation Status"],
 "home":["SYSTEM STATUS","Runs fully traceable","WORKFLOW","NAVIGATION"],
 "complaint":["COMPLAINT INVESTIGATION","Manufacturing record behind"],
 "raw_qc":["Release Status"],"raw_prod":["Handle Lot Number"],"raw_disp":["Dispatch Number"],"raw_handle":["Handle Lot No."],
 "arch":["2. WORKFLOW","3. MODULE MAP"]
}
out={}
for n,strs in want.items():
    d=pymupdf.open(f"pdf2/{n}.pdf"); p=d[0]
    pix=p.get_pixmap(dpi=DPI); a=np.frombuffer(pix.samples,np.uint8).reshape(pix.height,pix.width,pix.n)[:,:,:3]
    nz=np.where((a<248).any(axis=2)); oy,ox=nz[0].min(),nz[1].min()
    im=Image.open(f"png2/{n}.png"); out[n]={"w":im.size[0],"h":im.size[1],"a":{}}
    for t in strs:
        r=p.search_for(t)
        out[n]["a"][t]=[[round(q.x0*s-ox),round(q.y0*s-oy),round(q.x1*s-ox),round(q.y1*s-oy)] for q in r][:3]
json.dump(out,open("anchors.json","w"),indent=0,ensure_ascii=False)
for n in out: print(n,out[n]["w"],out[n]["h"],json.dumps(out[n]["a"],ensure_ascii=False)[:400])
