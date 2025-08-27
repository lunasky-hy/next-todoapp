import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: { domains: ["avatars.githubusercontent.com"] },
};

export default nextConfig;
