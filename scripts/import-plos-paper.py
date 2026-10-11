"""Import an explicitly CC BY 4.0 PLOS JATS paper as inert reader data.
Usage: python scripts/import-plos-paper.py --doi 10.1371/journal.pone.0308639 --slug nids-fgpa
Only publisher-hosted assets belonging to the requested DOI are fetched.
"""
import argparse, concurrent.futures, hashlib, io, json, re, time
from pathlib import Path
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET
from PIL import Image
parser=argparse.ArgumentParser()
parser.add_argument('--doi',required=True)
parser.add_argument('--slug',required=True)
args=parser.parse_args()
if not re.fullmatch(r'10\.1371/journal\.pone\.\d+',args.doi): raise ValueError('Only PLOS ONE DOI supported')
if not re.fullmatch(r'[a-z0-9-]+',args.slug): raise ValueError('Invalid slug')
root=Path(__file__).resolve().parents[1]
out=root/'public'/'papers'/args.slug
out.mkdir(parents=True,exist_ok=True)
xlink='{http://www.w3.org/1999/xlink}href'
base='https://journals.plos.org/plosone/'
def fetch(url):
 for attempt in range(3):
  try:
   with urlopen(Request(url,headers={'User-Agent':'Mineblogcraft local CC-BY paper importer'}),timeout=45) as r:return r.read()
  except Exception:
   if attempt==2:raise
   time.sleep(1+attempt)
source=out/'source.xml'
if not source.exists(): source.write_bytes(fetch(base+'article/file?id='+args.doi+'&type=manuscript'))
raw=source.read_bytes()
if b'<!ENTITY' in raw: raise ValueError('Entities are not allowed')
article=ET.fromstring(raw)
if article.findtext(".//article-id[@pub-id-type='doi']") != args.doi: raise ValueError('Cached source DOI mismatch')
license=article.find('.//license')
license_url=license.get(xlink,'') if license is not None else ''
if license_url.rstrip('/').replace('http:','https:')!='https://creativecommons.org/licenses/by/4.0': raise ValueError('Explicit CC BY 4.0 required')
graphics={g.get(xlink) for g in article.findall('.//graphic')}
assets={}
def asset(href):
 prefix='info:doi/'+args.doi+'.'
 if not href or not href.startswith(prefix):raise ValueError('Foreign graphic rejected')
 code=href[len(prefix):]
 if not re.fullmatch('[egt][0-9]+',code):raise ValueError('Invalid asset id')
 url=base+('article/file?type=thumbnail&id='+args.doi+'.'+code if code.startswith('e') else 'article/figure/image?size=large&id='+href)
 file=out/(code+'.png')
 if not file.exists():file.write_bytes(fetch(url))
 data=file.read_bytes()
 im=Image.open(io.BytesIO(data));im.verify()
 with Image.open(io.BytesIO(data)) as im:w,h=im.size
 return href,{'src':'/papers/'+args.slug+'/'+file.name,'width':w,'height':h,'url':url,'sha256':hashlib.sha256(data).hexdigest()}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for i,(href,record) in enumerate(pool.map(asset,sorted(graphics)),1):
  assets[href]=record
  if i%20==0:print('Validated assets:',i,flush=True)
def plain(node):return re.sub(r'\s+',' ',''.join(node.itertext())).strip() if node is not None else ''
def runs(node):
 result=[]
 def add(text):
  if text:
   text=re.sub(r'\s+',' ',text)
   if result and result[-1].get('text') is not None:result[-1]['text']+=text
   else:result.append({'text':text})
 def visit(n):
  if n.tag in ['inline-formula','disp-formula']:
   g=n.find('.//graphic')
   if g is not None:
    a=assets[g.get(xlink)];result.append({'src':a['src'],'width':a['width'],'height':a['height'],'alt':'Original formula '+g.get(xlink).split('.')[-1]})
    if n.tag=='disp-formula': add(' '+plain(n.find('label'))+' ')
   return
  add(n.text)
  for c in n:visit(c);add(c.tail)
 visit(node)
 return result
blocks=[]
def walk(node,level=1):
 for n in node:
  if n.tag=='sec':walk(n,min(level+1,3))
  elif n.tag=='title':blocks.append({'kind':'paragraph','heading':True,'text':plain(n),'runs':[{'text':plain(n)}]})
  elif n.tag in ['p','list-item']:
   if n.tag=='list-item':walk(n,level);continue
   blocks.append({'kind':'paragraph','runs':runs(n)})
  elif n.tag=='list':walk(n,level)
  elif n.tag in ['fig','table-wrap','disp-formula']:
   g=n.find('.//graphic')
   if g is not None:
    a=assets[g.get(xlink)]
    blocks.append({'kind':'image','src':a['src'],'width':a['width'],'height':a['height'],'alt':plain(n.find('label')) or 'Equation','caption':plain(n.find('caption')),'label':plain(n.find('label'))})
  elif n.tag in ['boxed-text','statement']:walk(n,level)
walk(article.find('body'))
refs=article.findall('.//ref-list/ref')
blocks.append({'kind':'paragraph','heading':True,'runs':[{'text':'References'}]})
for n in refs:blocks.append({'kind':'paragraph','runs':[{'text':plain(n)}]})
front=article.find('.//article-meta')
authors=[]
for c in front.findall('.//contrib'):
 if c.get('contrib-type')=='author':
  name=c.find('name');authors.append(plain(name.find('given-names'))+' '+plain(name.find('surname')))
abstract=plain(front.find('abstract'))
# Keep the complete abstract as the first text section, without changing its language.
blocks=[{'kind':'paragraph','heading':True,'runs':[{'text':'Abstract'}]},{'kind':'paragraph','runs':runs(front.find('abstract'))}]+blocks
metadata={'id':args.slug,'title':plain(front.find('.//article-title')),'author':', '.join(authors),'year':plain(front.find("pub-date[@pub-type='epub']/year")),'description':'联邦学习、同态加密与工业物联网入侵检测 · 英文原文','category':'AI / Cyber Security','keywords':['Federated Learning','Intrusion Detection','IIoT'],'cover':'/assets/inventory/enchanted-book.png','content':'/papers/'+args.slug+'/document.json','abstract':abstract,'draft':False,'format':'document','sourceUrl':base+'article?id='+args.doi,'doi':args.doi,'license':'CC BY 4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/','language':'English'}
(out/'document.json').write_text(json.dumps({'version':1,'blocks':blocks},ensure_ascii=False,indent=2),encoding='utf-8')
(out/'provenance.json').write_text(json.dumps({'metadata':metadata,'sourceXmlSha256':hashlib.sha256(raw).hexdigest(),'changes':'JATS converted to paginated JSON; original English text and publisher images retained. No translation.','assets':list(assets.values()),'blockCount':len(blocks),'references':len(refs)},ensure_ascii=False,indent=2),encoding='utf-8')
catalog=root/'src/data/papers.json'
papers=json.loads(catalog.read_text(encoding='utf-8'))
papers=[p for p in papers if p['id']!=args.slug]
for p in papers:p['cover']='/assets/inventory/enchanted-book.png'
papers.insert(0,metadata)
catalog.write_text(json.dumps(papers,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'blocks':len(blocks),'assets':len(assets),'references':len(refs),'characters':sum(len(str(b)) for b in blocks)},ensure_ascii=True),flush=True)
