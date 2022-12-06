/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "fastly-compute-js",
  devServerBroadcastDelay: 10000, // Adjust this if this is too short
  ignoredRouteFiles: ["**/.*"],
  // The following are the default values, feel free to uncomment and make adjustments as necessary
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
