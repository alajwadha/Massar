import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Guarantee the bare domain "/" always lands on the Arabic homepage,
  // independent of middleware locale detection.
  async redirects() {
    return [{ source: '/', destination: '/ar', permanent: false }];
  },
  // Customer plans (and every design-variant route that can render one) are
  // private tokenized links: keep them all out of search engines at the edge,
  // so no variant page can be indexed even if someone links to it.
  async headers() {
    const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];
    return ['c', 'v2', 'v4', 'v9', 'v10', 'glass', 'studio', 'min', 'm'].map((seg) => ({
      source: `/:locale/${seg}/:path*`,
      headers: noindex,
    }));
  },
};

export default withNextIntl(nextConfig);
