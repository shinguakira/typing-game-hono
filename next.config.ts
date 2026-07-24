import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Type checking is handled by tsgo (@typescript/native-preview) via the
    // `typecheck` script and the `build` script, so skip Next's slower internal
    // tsc pass. This does not disable type checking — tsgo gates the build.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint has been removed in favor of oxlint (`bun run lint`); make sure
    // `next build` never tries to run Next's ESLint integration.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
