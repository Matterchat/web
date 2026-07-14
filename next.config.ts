import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  turbopack: {
    root: path.join(process.cwd(), "../.."),
  },
  devIndicators: false,
};

export default nextConfig;
