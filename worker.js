// Dead spam URLs from a prior compromise (product/casino/roulette pages).
// They already 404; serving 410 Gone + noindex accelerates de-indexing.
// NEVER 301 these to "/" — that would launder spam signal onto the homepage.
const GONE = [
  /^\/products(\/|$)/i,
  /^\/video(\/|$)/i,
  /casino/i,
  /roulette/i,
];

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (GONE.some((re) => re.test(pathname))) {
      return new Response("410 Gone — this page has been permanently removed.", {
        status: 410,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "x-robots-tag": "noindex",
          "cache-control": "no-store",
        },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
