import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API route max duration for streaming
  serverExternalPackages: ["@anthropic-ai/sdk"],
};

export default nextConfig;
