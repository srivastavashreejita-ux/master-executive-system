import uno, sys, os, json
from com.sun.star.beans import PropertyValue
def P(n,v):
    p=PropertyValue(); p.Name=n; p.Value=v; return p
local=uno.getComponentContext()
res=local.ServiceManager.createInstanceWithContext("com.sun.star.bridge.UnoUrlResolver",local)
ctx=res.resolve("uno:socket,host=localhost,port=2002;urp;StarOffice.ComponentContext")
smgr=ctx.ServiceManager
desk=smgr.createInstanceWithContext("com.sun.star.frame.Desktop",ctx)
src=os.path.abspath(sys.argv[1]); out=os.path.abspath(sys.argv[2]); os.makedirs(out,exist_ok=True)
doc=desk.loadComponentFromURL(uno.systemPathToFileUrl(src),"_blank",0,(P("Hidden",True),))
doc.calculateAll()
sheets=doc.Sheets
names=[sheets.getByIndex(i).Name for i in range(sheets.Count)]
print(json.dumps(names,ensure_ascii=False))
doc.calculateAll()
# save recalculated copy
doc.storeToURL(uno.systemPathToFileUrl(out+"/recalc.xlsx"),(P("FilterName","Calc MS Excel 2007 XML"),))
doc.close(True)
