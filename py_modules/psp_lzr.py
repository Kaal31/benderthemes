"""LZR ("RLZ") decompression, the range-coded LZ format of the PSP firmware's resource files.
Pure-Python port of libLZR 0.11 by BenHur (CC BY-SA 3.0)."""


def lzr_decompress(src, limit=64 << 20):
    """Decompress one LZR stream; returns bytes, or None when the stream is broken."""
    if len(src) < 5:
        return None
    inp = bytes(src) + b"\0" * 16  # the decoder may look a few bytes past the end
    typ = inp[0] - 256 if inp[0] > 127 else inp[0]
    buffer = int.from_bytes(inp[1:5], "big")
    pos = 5
    if typ < 0:  # stored without compression
        return inp[5:5 + buffer] if buffer <= len(src) - 5 else None
    out = bytearray()
    buf = bytearray([0x80] * 2800)
    st = [0xFFFFFFFF, buffer, pos]  # mask, buffer, input position

    def fill(test):
        if test <= 0x00FFFFFF:
            st[1] = ((st[1] << 8) + inp[st[2]]) & 0xFFFFFFFF
            st[2] += 1
            st[0] = (test << 8) & 0xFFFFFFFF
            return True
        return False

    def bit(i):
        # next bit using probability cell buf[i]; returns 0/1
        fill(st[0])
        p = buf[i]
        value = ((st[0] >> 8) * p) & 0xFFFFFFFF
        buf[i] = (p - (p >> 3)) & 0xFF
        if st[1] < value:
            st[0] = value
            buf[i] = (buf[i] + 31) & 0xFF
            return 1
        st[1] -= value
        st[0] = (st[0] - value) & 0xFFFFFFFF
        return 0

    def bit_test(i, test):
        # LZRNextBit with a separate test mask (only the length-bits loop uses it)
        if test <= 0x00FFFFFF:
            st[1] = ((st[1] << 8) + inp[st[2]]) & 0xFFFFFFFF
            st[2] += 1
            st[0] = (test << 8) & 0xFFFFFFFF
        p = buf[i]
        value = ((st[0] >> 8) * p) & 0xFFFFFFFF
        test = value
        buf[i] = (p - (p >> 3)) & 0xFF
        if st[1] < value:
            st[0] = value
            buf[i] = (buf[i] + 31) & 0xFF
            return 1, test
        st[1] -= value
        st[0] = (st[0] - value) & 0xFFFFFFFF
        return 0, test

    def number(n_bits, base, inc):
        num = 1
        if n_bits >= 3:
            num = (num << 1) | bit(base + 3 * inc)
            if n_bits >= 4:
                num = (num << 1) | bit(base + 3 * inc)
                if n_bits >= 5:
                    fill(st[0])
                    while n_bits >= 5:
                        num <<= 1
                        st[0] >>= 1
                        if st[1] < st[0]:
                            num += 1
                        else:
                            st[1] -= st[0]
                        n_bits -= 1
        flag = bit(base)
        num = (num << 1) | flag
        if n_bits >= 1:
            num = (num << 1) | bit(base + inc)
            if n_bits >= 2:
                num = (num << 1) | bit(base + 2 * inc)
        return num, flag

    buf_off = 0
    last = 0
    end = len(src) + 8
    while True:
        if st[2] > end or len(out) > limit:
            return None
        p1 = buf_off + 2488
        if not bit(p1):
            if buf_off > 0:
                buf_off -= 1
            base = ((((((len(out) & 7) << 8) + last) >> typ) & 7) * 0xFF) - 1
            j = 1
            while j <= 0xFF:
                j = (j << 1) | bit(base + j)
            out.append(j & 0xFF)
        else:
            test = st[0]
            n_bits = -1
            while True:
                p1 += 8
                flag, test = bit_test(p1, test)
                n_bits += flag
                if not (flag and n_bits < 6):
                    break
            p2 = n_bits + 2033
            j = 64
            if flag or n_bits >= 0:
                p1 = (n_bits << 5) + ((((len(out)) << n_bits) & 3) << 3) + buf_off + 2552
                seq_len, flag = number(n_bits, p1, 8)
                if seq_len == 0xFF:
                    return bytes(out)
                if flag or n_bits > 0:
                    p2 += 56
                    j = 352
            else:
                seq_len = 1
            i = 1
            while True:
                n_bits = (i << 4) - j
                flag = bit(p2 + (i << 3))
                i = (i << 1) | flag
                if n_bits >= 0:
                    break
            if flag or n_bits > 0:
                if not flag:
                    n_bits -= 8
                seq_off, flag = number(int(n_bits / 8), n_bits + 2344, 1)
            else:
                seq_off = 1
            start = len(out) - seq_off
            if start < 0:
                return None
            count = seq_len + 1
            for k in range(count):
                out.append(out[start + k])
            buf_off = (((len(out)) + 1) & 1) + 6
        last = out[-1]
