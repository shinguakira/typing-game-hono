import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Type checking is handled by tsgo (@typescript/native-preview) via the
    // `typecheck` script and the `build` script, so skip Next's slower internal
    // tsc pass. This does not disable type checking — tsgo gates the build.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
