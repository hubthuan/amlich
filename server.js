/**
 * Web server cục bộ cho ứng dụng Âm Lịch Việt Nam
 * Sử dụng thư viện thuần Node.js, không cần cài thêm npm packages.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function requestHandler(req, res) {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Ngăn chặn directory traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>404 - Không tìm thấy trang</h2><p><a href="/">Quay lại trang chủ Âm Lịch</a></p></body></html>');
      return;
    }

    let actualFile = filePath;
    if (stats.isDirectory()) {
      actualFile = path.join(filePath, 'index.html');
    }

    const ext = path.extname(actualFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(actualFile, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error: ' + readErr.message);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
}

function startServer(port) {
  const server = http.createServer(requestHandler);

  server.listen(port, () => {
    console.log('='.repeat(55));
    console.log('  🏮 WEBSITE ÂM LỊCH VIỆT NAM ĐÃ KHỞI CHẠY!');
    console.log(`  🌐 Địa chỉ truy cập: http://localhost:${port}`);
    console.log(`  📅 Lịch tháng cũ:    http://localhost:${port}/month.html`);
    console.log(`  📜 Lịch ngày cũ:     http://localhost:${port}/day.html`);
    console.log('='.repeat(55));
    console.log('  Nhấn Ctrl + C để dừng máy chủ.');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Cổng ${port} đang bận, thử cổng kế tiếp ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Lỗi khởi động máy chủ:', err);
    }
  });
}

startServer(DEFAULT_PORT);
