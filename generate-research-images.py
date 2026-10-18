"""Generate original, illustrative modified Shepp–Logan phantom assets.
No reconstruction experiments or learned-model results are represented.
Website visitors need only the generated PNGs, not Python.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = Path(__file__).parent / 'assets'
OUT.mkdir(exist_ok=True)
# Modified Shepp–Logan ellipse model: intensity, axes, center, rotation (degrees).
ELLIPSES = [(1,.69,.92,0,0,0),(-.8,.6624,.874,0,-.0184,0),
 (-.2,.11,.31,.22,0,-18),(-.2,.16,.41,-.22,0,18),
 (.1,.21,.25,0,.35,0),(.1,.046,.046,0,.1,0),
 (.1,.046,.046,0,-.1,0),(.1,.046,.023,-.08,-.605,0),
 (.1,.023,.023,0,-.606,0),(.1,.023,.046,.06,-.605,0)]
n=768
y,x=np.mgrid[1:-1:complex(n),-1:1:complex(n)]
phantom=np.zeros((n,n))
for amp,a,b,cx,cy,deg in ELLIPSES:
    r=np.deg2rad(deg); xx=(x-cx)*np.cos(r)+(y-cy)*np.sin(r); yy=-(x-cx)*np.sin(r)+(y-cy)*np.cos(r)
    phantom[xx**2/a**2+yy**2/b**2<=1]+=amp
phantom=np.clip(phantom,0,1)
def gray(arr):
    # A fixed display window emphasizes the phantom's internal structures.
    return Image.fromarray(np.uint8(np.clip(arr/0.42,0,1)*255)).convert('RGB')
def canvas():return Image.new('RGB',(1200,680),'#101113')
def paste(im,arr,box):
    tile=gray(arr);tile=tile.resize((box[2],box[3]),Image.Resampling.LANCZOS);im.paste(tile,(box[0],box[1]))
def save(im,name):im.save(OUT/name,optimize=True)
# Analytic line integrals through each ellipse, 0 to 180 degrees.
t=np.linspace(-1,1,640)[:,None]; theta=np.linspace(0,np.pi,480)[None,:]
sino=np.zeros((640,480))
for amp,a,b,cx,cy,deg in ELLIPSES:
    phi=theta-np.deg2rad(deg); width2=(a*np.cos(phi))**2+(b*np.sin(phi))**2
    offset=t-cx*np.cos(theta)-cy*np.sin(theta)
    sino+=2*amp*a*b/width2*np.sqrt(np.maximum(width2-offset**2,0))
sino=np.clip(sino,0,None);sino=sino/sino.max()*.42
im=canvas();paste(im,phantom,(65,90,500,500));paste(im,sino,(655,110,440,460))
ImageDraw.Draw(im).line((610,90,610,590),fill='#33363a',width=1)
save(im,'research-phantom-projection.png')
# Synthetic noise is explicitly not an input/output model comparison.
rng=np.random.default_rng(7);noise=np.clip(phantom+rng.normal(0,.065,phantom.shape)*(x*x+y*y<.97),0,1)
im=canvas();paste(im,noise,(65,90,500,500));paste(im,phantom,(635,90,500,500))
ImageDraw.Draw(im).line((600,90,600,590),fill='#33363a',width=1)
save(im,'research-phantom-priors.png')
# Domain-partition illustration: all blocks are from the same synthetic image.
im=canvas();paste(im,phantom,(300,40,600,600));draw=ImageDraw.Draw(im)
for i in [1,2,3]:
    z=40+i*150;draw.line((300,z,900,z),fill='#5a6878',width=2)
    z=300+i*150;draw.line((z,40,z,640),fill='#5a6878',width=2)
draw.rectangle((300,40,899,639),outline='#5a6878',width=2)
save(im,'research-phantom-partitions.png')
# Multiscale views show only known phantom structure, not learned features.
im=canvas();paste(im,phantom,(60,70,540,540))
crop1=phantom[160:440,180:460];crop2=phantom[480:680,280:480]
paste(im,crop1,(750,65,270,270));paste(im,crop2,(750,355,270,270))
draw=ImageDraw.Draw(im);draw.rectangle((187,183,383,379),outline='#788697',width=2)
draw.rectangle((257,408,397,548),outline='#788697',width=2)
draw.line((384,183,720,183),fill='#495463',width=1);draw.line((398,480,720,480),fill='#495463',width=1)
save(im,'research-phantom-multiscale.png')
try:
    font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',22)
    small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',18)
except OSError:
    font=ImageFont.load_default();small=font
# Distinct regions of the same image are connected to distinct GPU workers.
im=canvas();paste(im,phantom,(60,100,480,480));draw=ImageDraw.Draw(im)
colors=['#87b6ec','#8bd0c3','#d6b78b','#bbabdf']
for i,color in enumerate(colors):
    top=100+i*120
    draw.rectangle((60,top,539,top+119),outline=color,width=3)
    row_y=65+i*150
    region=phantom[i*192:(i+1)*192,:]
    paste(im,region,(775,row_y+32,360,90))
    draw.rectangle((775,row_y+32,1134,row_y+121),outline=color,width=2)
    draw.line((540,top+60,625,top+60,700,row_y+77,760,row_y+77),fill=color,width=2)
    draw.polygon([(760,row_y+77),(750,row_y+71),(750,row_y+83)],fill=color)
    draw.text((775,row_y),f'GPU {i}  /  REGION {i+1}',font=font,fill=color)
draw.text((60,40),'IMAGE DOMAIN',font=font,fill='#c7ccd4')
save(im,'research-gpu-regions.png')
# An explicitly illustrative blurred/reference pair and a magnified region.
im=canvas();blurred=gray(phantom).filter(ImageFilter.GaussianBlur(7))
im.paste(blurred.resize((350,350),Image.Resampling.LANCZOS),(25,170))
paste(im,phantom,(435,170,350,350));paste(im,phantom[190:460,200:470],(895,220,250,250))
draw=ImageDraw.Draw(im)
draw.text((25,115),'BLURRED ILLUSTRATION',font=font,fill='#bbc4ce')
draw.text((435,115),'CLEAR REFERENCE',font=font,fill='#bbc4ce')
draw.text((895,165),'ENLARGED DETAIL',font=small,fill='#bbc4ce')
draw.line((390,345,420,345),fill='#a3b0c0',width=2)
draw.polygon([(420,345),(410,338),(410,352)],fill='#a3b0c0')
draw.rectangle((526,257,649,380),outline='#8da9ca',width=2)
draw.line((650,258,870,258),fill='#8da9ca',width=1)
draw.rectangle((895,220,1144,469),outline='#8da9ca',width=2)
draw.text((435,575),'Concept only — no algorithm output or performance claim',font=small,fill='#87929f')
save(im,'research-priors-detail.png')
preview=Image.new('RGB',(1200,680),'white')
for i,name in enumerate(['pytomography-spect-example.png','research-phantom-projection.png','research-gpu-regions.png','research-priors-detail.png']):
    preview.paste(Image.open(OUT/name).resize((600,340)),((i%2)*600,(i//2)*340))
preview.save(OUT/'research-preview.jpg',quality=90)
print('Generated scientific illustration assets and a four-card preview.')
