"""Read RAR/7z with the system libarchive, extracting only bounded regular files."""
import ctypes as C
import ctypes.util
from pathlib import Path,PurePosixPath
import stat

def unpack(source,destination,max_bytes=256*1024*1024,max_files=3000):
 name=C.util.find_library('archive')
 if not name:raise ValueError('RAR/7z support is unavailable on this system. Extract the archive into Downloads; ThemeHub will import that folder.')
 lib=C.CDLL(name)
 def bind(name,result,args):
  fn=getattr(lib,name);fn.restype=result;fn.argtypes=args;return fn
 new=bind('archive_read_new',C.c_void_p,[])
 support_filters=bind('archive_read_support_filter_all',C.c_int,[C.c_void_p]);support_formats=bind('archive_read_support_format_all',C.c_int,[C.c_void_p])
 open_file=bind('archive_read_open_filename',C.c_int,[C.c_void_p,C.c_char_p,C.c_size_t])
 next_header=bind('archive_read_next_header',C.c_int,[C.c_void_p,C.POINTER(C.c_void_p)])
 pathname=bind('archive_entry_pathname',C.c_char_p,[C.c_void_p]);filetype=bind('archive_entry_filetype',C.c_uint,[C.c_void_p]);size=bind('archive_entry_size',C.c_longlong,[C.c_void_p])
 symlink=bind('archive_entry_symlink',C.c_char_p,[C.c_void_p]);hardlink=bind('archive_entry_hardlink',C.c_char_p,[C.c_void_p])
 data=bind('archive_read_data',C.c_ssize_t,[C.c_void_p,C.c_void_p,C.c_size_t]);free=bind('archive_read_free',C.c_int,[C.c_void_p]);error=bind('archive_error_string',C.c_char_p,[C.c_void_p])
 archive=new()
 if not archive:raise ValueError('Could not open archive reader')
 total=0;count=0;seen=set();buffer=C.create_string_buffer(262144);destination=Path(destination);destination.mkdir(parents=True,exist_ok=True)
 try:
  support_filters(archive);support_formats(archive)
  if open_file(archive,str(source).encode('utf-8'),65536)<0:raise ValueError((error(archive) or b'Cannot open archive').decode('utf-8','replace'))
  entry=C.c_void_p()
  while True:
   status=next_header(archive,C.byref(entry))
   if status==1:break
   if status<0:raise ValueError((error(archive) or b'Cannot read archive').decode('utf-8','replace'))
   name=(pathname(entry) or b'').decode('utf-8','strict').replace('\\','/');path=PurePosixPath(name);kind=filetype(entry)
   if not name or path.is_absolute() or '..' in path.parts or ':' in name or symlink(entry) or hardlink(entry) or kind not in (stat.S_IFREG,stat.S_IFDIR):raise ValueError('Unsafe archive entry: '+name[:100])
   count+=1
   if count>max_files:raise ValueError('Archive contains too many files')
   key=name.casefold()
   if key in seen:raise ValueError('Duplicate archive entry: '+name[:100])
   seen.add(key);target=destination.joinpath(*path.parts)
   if kind==stat.S_IFDIR:target.mkdir(parents=True,exist_ok=True);continue
   expected=size(entry)
   if expected<0 or total+expected>max_bytes:raise ValueError('Archive exceeds extraction limit')
   target.parent.mkdir(parents=True,exist_ok=True);written=0
   with target.open('wb') as output:
    while True:
     length=data(archive,buffer,len(buffer))
     if length==0:break
     if length<0:raise ValueError('Archive data is incomplete')
     total+=length;written+=length
     if total>max_bytes or written>expected:raise ValueError('Archive exceeds extraction limit')
     output.write(buffer.raw[:length])
   if written!=expected:raise ValueError('Archive data is incomplete')
 finally:free(archive)
 return destination
