import asyncio
import importlib.util
import logging
from pathlib import Path
import sys
import tempfile
import types
import unittest


class MediaPerformance(unittest.IsolatedAsyncioTestCase):
    async def test_stream_ranges_head_and_revalidation(self):
        with tempfile.TemporaryDirectory() as folder:
            previous = sys.modules.get("decky")
            sys.modules["decky"] = types.SimpleNamespace(
                DECKY_PLUGIN_DIR=folder, DECKY_PLUGIN_SETTINGS_DIR=folder,
                DECKY_PLUGIN_RUNTIME_DIR=folder, logger=logging.getLogger("test"))
            try:
                spec = importlib.util.spec_from_file_location("performance_backend", Path(__file__).resolve().parents[1] / "main.py")
                backend = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(backend)
            finally:
                if previous is None:
                    sys.modules.pop("decky", None)
                else:
                    sys.modules["decky"] = previous
            path = Path(folder) / "test.webm"
            content = bytes(range(256)) * 4096
            path.write_bytes(content)
            backend._vi.files["test"] = str(path)
            server = await asyncio.start_server(backend._serve, "127.0.0.1", 0)
            async def request(method="GET", extra=""):
                reader, writer = await asyncio.open_connection("127.0.0.1", server.sockets[0].getsockname()[1])
                writer.write(f"{method} /{backend._vi.token}/f/test HTTP/1.1\r\nHost: localhost\r\n{extra}\r\n".encode())
                await writer.drain()
                response = await reader.read()
                writer.close()
                await writer.wait_closed()
                head, body = response.split(b"\r\n\r\n", 1)
                lines = head.decode().split("\r\n")
                return lines[0], dict(line.split(": ", 1) for line in lines[1:]), body
            try:
                status, headers, body = await request()
                self.assertIn("200", status)
                self.assertEqual(body, content)
                self.assertEqual(headers["Cache-Control"], "private, no-cache")
                etag = headers["ETag"]
                status, headers, body = await request(extra="Range: bytes=10-29\r\n")
                self.assertIn("206", status)
                self.assertEqual(body, content[10:30])
                self.assertEqual(headers["Content-Range"], f"bytes 10-29/{len(content)}")
                status, headers, body = await request("HEAD")
                self.assertEqual(body, b"")
                self.assertEqual(int(headers["Content-Length"]), len(content))
                status, _, body = await request(extra=f"If-None-Match: {etag}\r\n")
                self.assertIn("304", status)
                self.assertEqual(body, b"")
                path.write_bytes(b"replacement")
                status, headers, body = await request(extra=f"If-None-Match: {etag}\r\n")
                self.assertIn("200", status)
                self.assertNotEqual(headers["ETag"], etag)
                self.assertEqual(body, b"replacement")
            finally:
                server.close()
                await server.wait_closed()
