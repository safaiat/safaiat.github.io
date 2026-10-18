"""Render the public Siemens Lu-177 NEMA phantom data without a reconstruction claim.
This small reader handles only the known uncompressed explicit little-endian file.
"""
from pathlib import Path
import struct
import numpy as np
from PIL import Image
raw=Path('.local-research/scanner_recon.dcm').read_bytes()
assert raw[128:132]==b'DICM','Expected DICOM file'
def value(group,element,vr):
    marker=struct.pack('<HH',group,element)+vr.encode()
    offset=raw.find(marker)
    if offset<0:raise ValueError(f'Missing required tag {group:04x},{element:04x}')
    long=vr in ('OW','OB','UN','UT','SQ')
    length=struct.unpack_from('<I' if long else '<H',raw,offset+(8 if long else 6))[0]
    start=offset+(12 if long else 8)
    return raw[start:start+length]
syntax=value(2,0x10,'UI').strip(b'\x00 ').decode();assert syntax=='1.2.840.10008.1.2.1','Unexpected transfer syntax'
rows=struct.unpack('<H',value(0x28,0x10,'US'))[0];cols=struct.unpack('<H',value(0x28,0x11,'US'))[0]
frames=int(value(0x28,8,'IS').strip())
assert struct.unpack('<H',value(0x28,0x100,'US'))[0]==16
signed=struct.unpack('<H',value(0x28,0x103,'US'))[0]
pixels=np.frombuffer(value(0x7fe0,0x10,'OW'),dtype='<i2' if signed else '<u2').reshape(frames,rows,cols)
# Same vendor frame and display window used by the published documentation.
plane=pixels[61,40:98,30:98].astype(float)/96
level=np.clip(plane/27,0,1)
palette=np.array([[0,0,4],[28,16,68],[79,18,123],[129,37,129],[181,54,121],[229,80,100],[251,135,97],[254,194,135],[252,253,191]])
rgb=np.uint8(np.stack([np.interp(level,np.linspace(0,1,len(palette)),palette[:,c]) for c in range(3)],axis=-1))
tile=Image.fromarray(rgb).resize((620,529),Image.Resampling.BICUBIC)
canvas=Image.new('RGB',(1200,680),'#101113');canvas.paste(tile,((1200-620)//2,(680-529)//2))
canvas.save('assets/siemens-lu177-nema.png',optimize=True)
print('Rendered vendor phantom frame from the original dataset; no labels or patient metadata exported.')
