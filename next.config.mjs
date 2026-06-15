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
};

export default withNextIntl(nextConfig);
