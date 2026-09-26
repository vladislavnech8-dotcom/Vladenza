import http.server, socketserver, re, os
from pathlib import Path

DIST = Path(__file__).resolve().parent.parent / 'dist'

redirects = []
for line in (DIST / '_redirects').read_text().splitlines():
    line = line.strip()
    if not line or line.startswith('#'):
        continue
    parts = line.split()
    if len(parts) >= 3:
        redirects.append((parts[0], parts[1], int(parts[2])))

class RedirectHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        path = self.path.split('?')[0]

        for source, dest, code in redirects:
            if '*' in source:
                pattern = re.escape(source).replace(r'\*', '(.*)')
                match = re.match(f'^{pattern}$', path)
                if match:
                    wildcard_match = match.group(1)
                    final_dest = dest.replace(':splat', wildcard_match) if ':splat' in dest else dest
                    if code == 200:
                        self.serve_file(final_dest)
                        return
                    else:
                        self.send_response(code)
                        self.send_header('Location', final_dest)
                        self.end_headers()
                        return
            elif path == source:
                if code == 200:
                    self.serve_file(dest)
                    return
                elif code == 410:
                    self.serve_file(dest, 410)
                    return
                else:
                    self.send_response(code)
                    self.send_header('Location', dest)
                    self.end_headers()
                    return

        self.serve_file(path)

    def serve_file(self, path, status=200):
        if path == '/' or path == '':
            filepath = DIST / 'index.html'
        else:
            filepath = DIST / path.lstrip('/') / 'index.html'
            if not filepath.exists():
                filepath = DIST / path.lstrip('/')
                if not filepath.exists() or filepath.is_dir():
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b'Not Found')
                    return

        self.send_response(status)
        if str(filepath).endswith('.html'):
            self.send_header('Content-Type', 'text/html')
        self.end_headers()
        self.wfile.write(filepath.read_bytes())

PORT = 9876
with socketserver.TCPServer(("", PORT), RedirectHandler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()
