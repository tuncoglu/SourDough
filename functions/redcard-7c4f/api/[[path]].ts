// Pages exposes only the isolated app's read-only API through an internal service binding.
export async function onRequest(context: { request: Request; env: { REDCARD: { fetch(request: Request): Promise<Response> } } }): Promise<Response> {
  const url = new URL(context.request.url);
  url.pathname = url.pathname.replace(/^\/redcard-7c4f/, "");
  const upstream = new Request(url, { method: context.request.method, headers: { Accept: "application/json" } });
  try { return await context.env.REDCARD.fetch(upstream); }
  catch { return Response.json({ error: "Live data is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } }); }
}
