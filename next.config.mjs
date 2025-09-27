// next.config.js
/** @type {import('next').NextConfig} */

const api = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!api) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is required (e.g. https://api.myapp.com)");
}
const apiUrl = new URL(api);

const cdn = process.env.NEXT_PUBLIC_CDN_BASE_URL; 
const remotePatterns = [
  {
    protocol: apiUrl.protocol.replace(":", ""), // "http" | "https"
    hostname: apiUrl.hostname,
    ...(apiUrl.port ? { port: apiUrl.port } : {}),
    pathname: "/v1/images/**",
  },
];

if (cdn) {
  const cdnUrl = new URL(cdn);
  remotePatterns.push({
    protocol: cdnUrl.protocol.replace(":", ""),
    hostname: cdnUrl.hostname,
    ...(cdnUrl.port ? { port: cdnUrl.port } : {}),
    pathname: "/**",
  });
}

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/media/:id",
        destination: `${apiUrl.origin}/v1/images/:id`,
      },
    ];
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
