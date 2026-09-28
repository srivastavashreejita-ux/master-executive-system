from PIL import Image
import json
M='src/ppt/media/'; R='shots/'
spec = {
 'dash_top': (M+'image-11-1.png',1.134,(0,0,2000,555)),
 'prod_full':(M+'image-12-1.png',1.066,None),
 'prod_drill':(M+'image-12-1.png',1.066,(0,590,1230,766)),
 'qual_full':(M+'image-12-2.png',1.061,None),
 'qual_pareto':(M+'image-12-2.png',1.061,(10,515,755,850)),
 'oee_top':(M+'image-16-1.png',1.066,(0,0,1985,632)),
 't6_search':(R+'r_trace6_1.png',1.531,(0,105,1995,173)),
 't6_table':(R+'r_trace6_1.png',1.531,(0,215,818,367)),
 't1_search':(R+'r_trace1_1.png',1.531,(0,105,1995,173)),
 't1_row':(R+'r_trace1_1.png',1.531,(0,215,818,271)),
 't1_key':(R+'r_trace1_1.png',1.531,(0,670,1392,736)),
 't1_record':(R+'r_trace1_1.png',1.531,(0,750,1995,1226)),
 't1_mfg':(R+'r_trace1_1.png',1.531,(815,750,1392,950)),
 't1_mat':(R+'r_trace1_1.png',1.531,(815,965,1392,1205)),
 't1_mach':(R+'r_trace1_1.png',1.531,(1468,965,1995,1224)),
 'c_top':(R+'r_comp_0.png',1.2685,(0,0,1995,165)),
 'c_L':(R+'r_comp_0.png',1.2685,(0,178,620,456)),
 'c_R':(R+'r_comp_0.png',1.2685,(885,236,1790,456)),
 'r_dir1':(R+'r_rev_1.png',1.448,(0,105,1995,350)),
 'r_dir2':(R+'r_rev_1.png',1.448,(0,390,1560,572)),
 'prod_zoom':(M+'image-12-1.png',1.066,(0,668,730,766)),
}
out={}
for k,(f,s,b) in spec.items():
    im=Image.open(f).convert('RGB')
    if b: im=im.crop(tuple(int(v*s) for v in b))
    im.save(f'crops/{k}.png'); out[k]={'path':f'crops/{k}.png','ar':round(im.width/im.height,4),'px':im.size}
    print(k, im.size, out[k]['ar'])
json.dump(out,open('crops/index.json','w'),indent=1)
