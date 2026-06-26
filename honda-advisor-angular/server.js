const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const port = Number(process.env.PORT) || 4200;
const publicRoot = path.join(__dirname, 'dist', 'honda-advisor-angular', 'browser');
const indexFile = path.join(publicRoot, 'index.html');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function proxyApiRequest(req, res, requestUrl) {
  const apiOrigin = (process.env.API_ORIGIN || process.env.API_BASE_URL || '').trim().replace(/\/$/, '');

  if (!apiOrigin) {
    sendJson(res, 503, {
      success: false,
      message: 'API_ORIGIN is not configured for the frontend service.'
    });
    return;
  }

  const originIncludesApiPath = /\/api$/i.test(apiOrigin);
  const targetPath = originIncludesApiPath
    ? requestUrl.pathname.replace(/^\/api/i, '') || '/'
    : requestUrl.pathname;
  const targetUrl = `${apiOrigin}${targetPath}${requestUrl.search}`;

  const headers = { ...req.headers };
  delete headers.host;
  headers['x-forwarded-host'] = req.headers.host || '';
  headers['x-forwarded-proto'] = 'https';

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : req,
      duplex: ['GET', 'HEAD'].includes(req.method || '') ? undefined : 'half',
      redirect: 'manual'
    });

    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    }

    res.end();
  } catch (error) {
    console.error('API proxy failed:', error);
    sendJson(res, 502, {
      success: false,
      message: 'Unable to reach the API service.'
    });
  }
}

function resolveStaticFile(requestPath) {
  const decodedPath = decodeURIComponent(requestPath);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const candidate = path.join(publicRoot, safePath);

  if (!candidate.startsWith(publicRoot)) {
    return indexFile;
  }

  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  return indexFile;
}

function serveStatic(req, res, requestUrl) {
  if (!['GET', 'HEAD'].includes(req.method || '')) {
    res.writeHead(405, { allow: 'GET, HEAD' });
    res.end();
    return;
  }

  const filePath = resolveStaticFile(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
  const extension = path.extname(filePath).toLowerCase();
  const isHashedAsset = /\.(js|css|png|jpg|jpeg|webp|svg|ico)$/i.test(filePath);

  res.writeHead(200, {
    'content-type': mimeTypes[extension] || 'application/octet-stream',
    'cache-control': isHashedAsset
      ? 'public, max-age=31536000, immutable'
      : 'no-cache'
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (requestUrl.pathname.startsWith('/api')) {
    await proxyApiRequest(req, res, requestUrl);
    return;
  }

  serveStatic(req, res, requestUrl);
});

server.listen(port, () => {
  console.log(`Honda Advisor frontend running on port ${port}`);
});
