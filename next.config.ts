import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Allow cross-origin requests from development IPs
  allowedDevOrigins: [
    "10.0.2.94",
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
  ],
};

export default nextConfig;
