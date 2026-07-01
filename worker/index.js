export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Remove the /sourdough prefix before forwarding to Pages
    // e.g., enftc.co.uk/sourdough/app → sourdough.pages.dev/app
    url.hostname = `${env.PAGES_PROJECT}.pages.dev`;
    url.pathname = url.pathname.replace(/^\/sourdough/, "") || "/";

    const modifiedRequest = new Request(url, request);
    return fetch(modifiedRequest);
  },
};
