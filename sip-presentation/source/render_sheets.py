import openpyxl, sys, datetime as dt
variants = {
 'trace6':  ('🖨️ TRACE REPORT', {'A7':'JHS-26433','C7':'(All)','F7':'(All)','H7':dt.datetime(2026,6,8),'J7':dt.datetime(2026,9,5)}, 'A1:N30'),
 'trace1':  ('🖨️ TRACE REPORT', {'A7':'JHS-26433','C7':'Dabur Red Toothbrush — Medium','F7':'RED','H7':dt.datetime(2026,7,14),'J7':dt.datetime(2026,7,14),'A35':1}, 'A1:N76'),
 'comp':    ('🔍 COMPLAINT TOOL', {'A12':'CMP-26-0024'}, 'A1:T28'),
 'rev':     ('🔄 REVERSE TRACE', {'A7':'PR-2026-00630','A21':'HL-DBR-26-0519'}, 'A1:R30'),
}
name=sys.argv[1]; sheet,edits,area=variants[name]
wb=openpyxl.load_workbook('orig.xlsx')
for ws in wb.worksheets:
    if ws.title!=sheet: ws.sheet_state='hidden'
ws=wb[sheet]; wb.active=wb.worksheets.index(ws)
for k,v in edits.items(): ws[k].value=v
ws.print_area=area
ws.page_setup.orientation='landscape'; ws.sheet_properties.pageSetUpPr.fitToPage=True
ws.page_setup.fitToWidth=1; ws.page_setup.fitToHeight=0
wb.save(f'v_{name}.xlsx')
