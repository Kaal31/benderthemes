"""PS3 linear GIM texture decoding: preserve DXT alpha and reject truncated surfaces."""
import sys,struct
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
from console_themes import gim_decode
b=bytearray(96);b[:4]=b'.GIM';struct.pack_into('>HHIII',b,16,4,0,80,0,16)
struct.pack_into('>HHHHHH',b,32,48,0,10,0,4,4);struct.pack_into('>I',b,60,48)
b[80:96]=bytes([128,128,0,0,0,0,0,0])+struct.pack('<HHI',0xf800,0,0)
w,h,rgba=gim_decode(bytes(b));assert (w,h)==(4,4);assert len(rgba)==64
assert all(rgba[i]>240 and rgba[i+1]==0 and rgba[i+2]==0 and rgba[i+3]==128 for i in range(0,64,4))
assert gim_decode(bytes(b[:-1])) is None
struct.pack_into('>H',b,40,5000);assert gim_decode(bytes(b)) is None
print('PASS PS3 DXT GIM colour, alpha, truncation and dimensions')
