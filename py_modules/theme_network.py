"""HTTPS trust for Decky's embedded Python and the SteamOS system CA store."""
from functools import lru_cache
from pathlib import Path
import ssl
from urllib.request import urlopen as _urlopen

CA_FILES = (
    "/etc/ssl/certs/ca-certificates.crt",
    "/etc/ca-certificates/extracted/tls-ca-bundle.pem",
    "/etc/pki/tls/certs/ca-bundle.crt",
)

@lru_cache(maxsize=1)
def ssl_context():
    context = ssl.create_default_context()
    for filename in CA_FILES:
        if Path(filename).is_file():
            try:
                context.load_verify_locations(cafile=filename)
            except (OSError, ssl.SSLError):
                continue
    return context

def urlopen(request, timeout=20):
    return _urlopen(request, timeout=timeout, context=ssl_context())
