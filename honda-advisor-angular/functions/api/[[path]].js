export async function onRequest({ env, request }) {
  const apiOrigin = (env.API_ORIGIN || env.API_BASE_URL || '').trim().replace(/\/$/, '');

  if (!apiOrigin) {
    return Response.json(
      {
        success: false,
        message: 'API origin is not configured for this Cloudflare Pages deployment.'
      },
      { status: 503 }
    );
  }

  const incomingUrl = new URL(request.url);
  const originIncludesApiPath = /\/api$/i.test(apiOrigin);
  const targetPath = originIncludesApiPath
    ? incomingUrl.pathname.replace(/^\/api/i, '') || '/'
    : incomingUrl.pathname;
  const targetUrl = new URL(`${apiOrigin}${targetPath}${incomingUrl.search}`);

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('x-forwarded-host', incomingUrl.host);
  headers.set('x-forwarded-proto', incomingUrl.protocol.replace(':', ''));

  const init = {
    method: request.method,
    headers,
    redirect: 'manual'
  };

  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = request.body;
  }

  const response = await fetch(targetUrl, init);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
