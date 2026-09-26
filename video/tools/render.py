import uno, sys, os, json
from com.sun.star.beans import PropertyValue
def P(n,v):
    p=PropertyValue(); p.Name=n; p.Value=v; return p
local=uno.getComponentContext()
res=local.ServiceManager.createInstanceWithContext("com.sun.star.bridge.UnoUrlResolver",local)
ctx=res.resolve("uno:socket,host=localhost,port=2002;urp;StarOffice.ComponentContext")
desk=ctx.ServiceManager.createInstanceWithContext("com.sun.star.frame.Desktop",ctx)
jobs=json.load(open(sys.argv[2]))
src=os.path.abspath(sys.argv[1]); out=os.path.abspath(sys.argv[3]); os.makedirs(out,exist_ok=True)
doc=desk.loadComponentFromURL(uno.systemPathToFileUrl(src),"_blank",0,(P("Hidden",True),))
for job in jobs:
    # optional input edits: [["sheet","A7","value"],...]
    for sh,addr,val in job.get("set",[]):
        c=doc.Sheets.getByName(sh).getCellRangeByName(addr)
        if isinstance(val,(int,float)): c.setValue(val)
        else: c.setString(val)
    doc.calculateAll()
    sh=doc.Sheets.getByName(job["sheet"])
    ps=doc.StyleFamilies.getByName("PageStyles").getByName(sh.PageStyle)
    ps.HeaderIsOn=False; ps.FooterIsOn=False
    for k in ("LeftMargin","RightMargin","TopMargin","BottomMargin"): setattr(ps,k,0)
    ps.PrintGrid=job.get("grid",False); ps.PrintHeaders=False
    ps.ScaleToPagesX=1; ps.ScaleToPagesY=1
    ps.IsLandscape=True
    ps.Width=job.get("pw",60000); ps.Height=job.get("ph",34000)
    rng=sh.getCellRangeByName(job["range"])
    sh.setPrintAreas((rng.RangeAddress,))
    fd=uno.Any("[]com.sun.star.beans.PropertyValue",tuple([P("Selection",rng)]))
    doc.storeToURL(uno.systemPathToFileUrl(f"{out}/{job['id']}.pdf"),(P("FilterName","calc_pdf_Export"),P("FilterData",fd)))
    print("ok",job["id"])
doc.close(True)
