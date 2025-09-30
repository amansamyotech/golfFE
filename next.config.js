// // import type { NextConfig } from "next";
// // import withBundleAnalyzer from "@next/bundle-analyzer";

// // const withAnalyzer = withBundleAnalyzer({
// //   enabled: process.env.ANALYZE === "true",
// // });

// // const nextConfig: NextConfig = {
// //   reactStrictMode: false, // Optional: Disable during dev if it causes double rendering
// //   swcMinify: true,        // Uses SWC compiler for faster builds
// //   compress: true,         // Enables gzip compression for responses
// //   experimental: {
// //     optimizeCss: true,    // Optional: can improve CSS performance
// //   },
// //   webpack(config) {
// //     config.module.rules.push({
// //       test: /\.svg$/,
// //       use: ["@svgr/webpack"],
// //     });
// //     return config;
// //   },
// // };

// // export default withAnalyzer(nextConfig);

// import type { NextConfig } from "next";
// import withBundleAnalyzer from "@next/bundle-analyzer";

// const withAnalyzer = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// });

// const nextConfig: NextConfig = {
//   reactStrictMode: false, // Optional: Disable during dev if it causes double rendering
//   compress: true,         // Enables gzip compression for responses
//   experimental: {
//     optimizeCss: true,    // Optional: can improve CSS performance
//   },
//   images: {
//     domains: ['localhost'], // allow images served from localhost
//   },
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ["@svgr/webpack"],
//     });
//     return config;
//   },
// };

// export default withAnalyzer(nextConfig);



const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: false, 
  compress: true,         
  images: {
    domains: ['localhost'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
