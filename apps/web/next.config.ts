import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: [
    "@invoice-generator/modules",
    "@invoice-generator/types",
    "@invoice-generator/ui",
  ],
};
export default nextConfig;
