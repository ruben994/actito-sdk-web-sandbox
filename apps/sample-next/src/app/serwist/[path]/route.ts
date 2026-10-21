import { createSerwistRoute } from "@serwist/turbopack";
import nextConfig from "@/../next.config";

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute(
  {
    swSrc: "worker/index.ts",
    nextConfig,
    useNativeEsbuild: true,
  },
);
