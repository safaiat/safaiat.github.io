"""Read only the vendor phantom reconstruction from the public Zenodo ZIP.
HTTP ranges avoid downloading the 1.4 GB archive. Full provenance is retained.
"""
import io, urllib.request, zipfile
from pathlib import Path
URL='https://zenodo.org/api/records/15314460/files/SPECT.zip/content'
class RemoteZIP(io.RawIOBase):
    def __init__(self): self.pos=0; self.length=1430341130
    def seekable(self): return True
    def readable(self): return True
    def tell(self): return self.pos
    def seek(self,offset,whence=0):
        self.pos=offset if whence==0 else self.pos+offset if whence==1 else self.length+offset
        return self.pos
    def read(self,size=-1):
        if size<0: size=self.length-self.pos
        size=min(size,self.length-self.pos)
        if not size:return b''
        if size>16000000:raise RuntimeError('Refusing oversized archive transfer')
        req=urllib.request.Request(URL,headers={'Range':f'bytes={self.pos}-{self.pos+size-1}','User-Agent':'Academic portfolio asset preparation'})
        with urllib.request.urlopen(req,timeout=40) as response:
            if response.status!=206:raise RuntimeError('Server did not honor bounded range request')
            data=response.read(size)
        self.pos+=len(data);return data
with zipfile.ZipFile(RemoteZIP()) as archive:
    names=[name for name in archive.namelist() if 'Lu177-NEMA-SymT2' in name and 'scanner_recon' in name and '__MACOSX' not in name]
    if len(names)!=1:raise RuntimeError('Could not identify a unique vendor reconstruction: '+str(names))
    info=archive.getinfo(names[0]);print('Selected:',info.filename,'size:',info.file_size)
    target=Path('.local-research');target.mkdir(exist_ok=True)
    (target/'scanner_recon.dcm').write_bytes(archive.read(info))
    print('Saved vendor reconstruction directly from the dataset archive.')
