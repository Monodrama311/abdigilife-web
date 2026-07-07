// AB Digilife site worker
//  - 410 Gone for dead spam URLs from a prior compromise (product/casino/roulette).
//    They already 404; serving 410 + noindex accelerates de-indexing.
//    NEVER 301 these to "/" — that would launder spam signal onto the homepage.
//  - Security headers applied to EVERY response (static assets + 410).
//
// CSP note: every page is hand-built with inline <style>/<script> (no bundler),
// so 'unsafe-inline' is required. Fonts come from Google Fonts + Fontshare.
// Kept deliberately permissive on style/font hosts to avoid breaking the live
// look; the hardening value is in the other headers + frame-ancestors.
const GONE = [
  /^\/products(\/|$)/i,
  /^\/video(\/|$)/i,
  /casino/i,
  /roulette/i,
];

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
  "font-src 'self' data: https://fonts.gstatic.com https://api.fontshare.com https://cdn.fontshare.com",
  "img-src 'self' data: https:",
  "media-src 'self' https:",
  "connect-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": CSP,
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

function withSecurity(base) {
  const h = new Headers(base);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) h.set(k, v);
  return h;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (GONE.some((re) => re.test(pathname))) {
      return new Response("410 Gone — this page has been permanently removed.", {
        status: 410,
        headers: withSecurity({
          "content-type": "text/plain; charset=utf-8",
          "x-robots-tag": "noindex",
          "cache-control": "no-store",
        }),
      });
    }

    const res = await env.ASSETS.fetch(request);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: withSecurity(res.headers),
    });
  },
};
