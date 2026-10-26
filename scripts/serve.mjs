import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const root = resolve('.');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.md': 'text/plain', '.zip': 'application/zip' };
createServer(async (request, response) => {
    try {
        let file = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
        if (file !== root && !file.startsWith(root + sep)) throw new Error('Invalid path');
        if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
        response.end(await readFile(file));
    } catch {
        response.writeHead(404).end('Not found');
    }
}).listen(8000, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:8000'));
