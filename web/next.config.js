/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const withPWA = require("next-pwa");
const { releaseDate } = require("./scripts/release-config");
const { extVersion } = require("../common/src/scripts/extension-version");

const isDev = process.env.NODE_ENV === "development";

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const nextConfig = {
  // next-pwa options
  pwa: {
    swSrc: "./scripts/sw.js",
    dest: "public",
  },
  // Rest options are nextJS's
  swcMinify: true,
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  experimental: {
    //To build common folder, which is outside root directory; https://github.com/vercel/next.js/issues/5666
    externalDir: true,
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack: (config, { dev, isServer, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        __PROD__: JSON.stringify(!dev),
        __EXT_VERSION__: JSON.stringify(extVersion),
        __RELEASE_DATE__: JSON.stringify(releaseDate),
        HOST_NAME: JSON.stringify(process.env.HOST_NAME),
        __SERVER__: JSON.stringify(isServer),
      })
    );
    if (dev) {
      config.plugins.push(
        new ForkTsCheckerWebpackPlugin(),
        new ESLintPlugin({
          files: "./src/**/*.{js,ts,tsx}",
          threads: true,
          cache: true,
        })
      );
    }
    // https://github.com/firebase/firebase-admin-node/issues/84
    config.externals.push("firebase-admin");
    return config;
  },
};

// Disable service worker on dev
module.exports = isDev ? nextConfig : withPWA(nextConfig);
