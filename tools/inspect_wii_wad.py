"""Extract a local WAD for resource research; no keys or firmware are bundled.

Requires pycryptodome. Format cross-checked against wii-tools/wadlib.
All contents are SHA-1 verified before any output is written.
"""
import argparse
import hashlib
import json
import struct
from pathlib import Path


def unpack(data, common_key, decrypt):
    if len(data) < 64 or len(data) > 128 * 1024 * 1024:
        raise ValueError('Invalid WAD size')
    header, _, cert, crl, ticket_size, tmd_size, data_size, _ = struct.unpack_from('>I4s6I', data)
    if header != 32:
        raise ValueError('Unsupported WAD header')
    align = lambda n: (n + 63) & ~63
    offset = align(header)
    sections = []
    for size in (cert, crl, ticket_size, tmd_size, data_size):
        if offset + size > len(data):
            raise ValueError('Truncated WAD section')
        sections.append(data[offset:offset + size])
        offset += align(size)
    ticket, tmd, contents = sections[2:]
    if len(ticket) < 0x1f2 or len(tmd) < 0x1e4:
        raise ValueError('Truncated ticket or TMD')
    if ticket[:4] != b'\x00\x01\x00\x01' or tmd[:4] != b'\x00\x01\x00\x01':
        raise ValueError('Unsupported signature type')
    if ticket[0x1f1] != 0:
        raise ValueError('Only standard Wii common-key tickets are supported')
    title = ticket[0x1dc:0x1e4]
    if title != tmd[0x18c:0x194]:
        raise ValueError('Ticket and TMD title IDs differ')
    title_key = decrypt(common_key, title + bytes(8), ticket[0x1bf:0x1cf])
    version, count = struct.unpack_from('>HH', tmd, 0x1dc)
    if count > 512 or len(tmd) < 0x1e4 + count * 36:
        raise ValueError('Invalid content count')
    records = []
    offset = 0
    for i in range(count):
        cid, index, kind, size = struct.unpack_from('>IHHQ', tmd, 0x1e4 + i * 36)
        digest = tmd[0x1e4 + i * 36 + 16:0x1e4 + (i + 1) * 36]
        padded = (size + 15) & ~15
        if offset + padded > len(contents):
            raise ValueError('Truncated encrypted content')
        plain = decrypt(title_key, struct.pack('>H', index) + bytes(14), contents[offset:offset + padded])[:size]
        if hashlib.sha1(plain).digest() != digest:
            raise ValueError('Content integrity check failed')
        records.append((dict(id=f'{cid:08x}', index=index, type=kind, size=size, sha1=digest.hex()), plain))
        offset += align(padded)
    return dict(titleId=title.hex(), version=version), records


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('wad', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--common-key', required=True, type=Path, help='Local 16-byte key file')
    args = parser.parse_args()
    from Crypto.Cipher import AES
    key = args.common_key.read_bytes()
    if len(key) != 16:
        raise ValueError('Common key must be exactly 16 bytes')
    metadata, records = unpack(args.wad.read_bytes(), key, lambda k, iv, data: AES.new(k, AES.MODE_CBC, iv).decrypt(data))
    args.output.mkdir(parents=True, exist_ok=False)
    for record, plain in records:
        (args.output / (record['id'] + '.app')).write_bytes(plain)
    metadata['contents'] = [record for record, _ in records]
    (args.output / 'manifest.json').write_text(json.dumps(metadata, indent=2), encoding='utf-8')
    print(json.dumps(metadata, indent=2))
