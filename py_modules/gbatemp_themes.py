"""Read public WiiFlow theme indexes. No login, archive downloads, or challenge bypass."""
import re
from html import unescape
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit

THREADS = (
    'https://gbatemp.net/threads/wiiflow-themes.180497/',
    'https://gbatemp.net/threads/rhapsodii-shima-5-4.555062/',
    'https://gbatemp.net/threads/wiiflow-themes-20-in-one-pack-extras-for-v-5-5-4.657626/',
)

def public_url(value):
    url = urljoin('https://gbatemp.net/', unescape(value or ''))
    p = urlsplit(url)
    if p.scheme not in ('http', 'https') or not p.hostname or p.username or p.password:
        return ''
    if p.hostname.lower() in ('localhost',) or ':' in p.hostname or re.fullmatch(r'[\d.]+', p.hostname):
        return ''
    return 'https://' + url.split('://', 1)[1]

class Body(HTMLParser):
    def __init__(self):
        super().__init__(); self.depth = 0; self.parts = []; self.images = []; self.links = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if not self.depth:
            if tag == 'div' and 'bbWrapper' in a.get('class', '').split(): self.depth = 1
            return
        if tag == 'div': self.depth += 1
        if tag in ('br', 'p'): self.parts.append('\n')
        if tag == 'img':
            u = public_url(a.get('data-src') or a.get('data-url') or a.get('src'))
            if u and not any(x in u for x in ('smilies/', 'avatars/')): self.images.append(u)
        if tag == 'a':
            u = public_url(a.get('href'))
            if u: self.links.append(u)
    def handle_endtag(self, tag):
        if self.depth and tag == 'div': self.depth -= 1
    def handle_data(self, data):
        if self.depth: self.parts.append(data)

def parse(html, page):
    # First post only: replies and quoted reposts are not catalog entries.
    articles = re.findall(r'<article\b.*?</article>', html, re.S | re.I)
    if not articles: raise ValueError('GBAtemp returned no public posts')
    post = articles[0]
    author = re.search(r'data-author="([^"]+)"', post)
    author = unescape(author.group(1)) if author else ''
    heads = list(re.finditer(r'<b>(?:<span[^>]*>)*\s*\d+\*\s*([^<]+)', post, re.I))
    chunks = [(h.group(1).strip(), post[h.start():heads[i+1].start() if i+1<len(heads) else len(post)]) for i,h in enumerate(heads)]
    creators = list(re.finditer(r'<span style="color: #FF0000"><b><span style="font-size: 18px">([^<]+)', post))
    if not chunks:
        title = re.search(r'<h1\b[^>]*>(.*?)</h1>', html, re.S)
        chunks = [(re.sub('<[^>]+>', '', title.group(1)).strip() if title else 'WiiFlow theme', post)]
    out = []
    for i, (name, chunk) in enumerate(chunks):
        # Each index fragment starts inside bbWrapper; standalone posts already contain it.
        b = Body(); b.feed(chunk if not heads else '<div class="bbWrapper">'+chunk+'</div>')
        text = ' '.join(''.join(b.parts).split())
        metadata = re.findall(r'(?:4:3\s+(?:Yes|No|!!)\s*/\s*16:9\s+(?:Yes|No)|Version\s+[\d.]+|Updated\s+(?:Yes|No))', text, re.I)
        description = '; '.join(metadata) if heads else text[:280]
        links = list(dict.fromkeys(u for u in b.links if any(x in u.lower() for x in ('mediafire.com/', '/downloads/', '.zip', '.rar', '.7z')) and not any(x in u for x in ('imageview', 'imgbnc'))))
        images = list(dict.fromkeys(b.images))[:8]
        out.append({'id': page.split('.')[-1].strip('/')+'-'+str(i), 'name': unescape(name)[:120],
                    'author': author if not heads else next((unescape(c.group(1)) for c in reversed(creators) if c.start()<heads[i].start()), ''), 'image': images[0] if images else '', 'images': images,
                    'page': page, 'description': description[:280], 'externalLinks': links[:8],
                    'externalOnly': True, 'files': [], 'tag': 'WiiFlow · archive compatibility unverified'})
    return out
