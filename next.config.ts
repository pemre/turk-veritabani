import type { NextConfig } from "next";
// Emre: Let's pass package.json version to the app
const { version } = require('./package.json');

const nextConfig: NextConfig = {
    /**
     * Enable static exports.
     *
     * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
     */
    output: "export",

    /**
     * Set base path. This is the slug of your GitHub repository.
     *
     * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
     */
    basePath: "/turk-veritabani",

    /**
     * Disable server-based image optimization. Next.js does not support
     * dynamic features with static exports.
     *
     * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
     */
    images: {
        unoptimized: true,
    },
    // Custom env to pass package.json version to app
    env: {
        NEXT_PUBLIC_APP_VERSION: version,
    },
};

export default nextConfig;
