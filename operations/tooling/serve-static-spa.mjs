import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const [rootArg, portArg] = process.argv.slice(2);

if (!rootArg) {
  throw new Error('Usage: node serve-static-spa.mjs <rootDir> [port]');
}

const rootDir = resolve(rootArg);
const port = Number.parseInt(portArg ?? '4300', 10);

if (!existsSync(rootDir) || !statSync(rootDir).isDirectory()) {
  throw new Error(`Static root directory not found: ${rootDir}`);
}

const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const requestedPath = decodeURIComponent(requestUrl.pathname);
  const normalizedPath = normalize(requestedPath).replace(/^[\\/]+/, '');
  let filePath = join(rootDir, normalizedPath);

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(rootDir, 'index.html');
  }

  const extension = extname(filePath);
  const contentType = MIME_TYPES.get(extension) ?? 'application/octet-stream';

  response.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });

  createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static SPA server listening on http://127.0.0.1:${port}`);
  console.log(`Serving root: ${rootDir}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);