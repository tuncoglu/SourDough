export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Remove the /sourdough prefix before forwarding to Pages
    // e.g., enftc.co.uk/sourdough/app → sourdough.pages.dev/app
    url.hostname = `${env.PAGES_PROJECT}.pages.dev`;
    url.pathname = url.pathname.replace(/^\/sourdough/, "") || "/";

    const modifiedRequest = new Request(url, request);
    const upstreamResponse = await fetch(modifiedRequest);

    // Clone the response so we can add security headers
    const response = new Response(upstreamResponse.body, upstreamResponse);

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload");
    response.headers.set("Permissions-Policy", "geolocation=self, notifications=self");

    // Cache static assets at the edge (1 hour for HTML, 1 year for hashed assets)
    const pathname = url.pathname;
    if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/i.test(pathname)) {
      response.headers.set("Cache-Control",
        "public, max-age=31536000, immutable");
    } else {
      response.headers.set("Cache-Control",
        "public, max-age=3600, must-revalidate");
    }

    return response;
  },
};
