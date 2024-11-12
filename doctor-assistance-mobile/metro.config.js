// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");
// const resolveFrom = require("resolve-from");

// const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

// console.log("Initial config:", config);

// // Redirection to handle event-target-shim version conflict for react-native-webrtc
// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   console.log("Resolving module:", moduleName);
  
//   if (
//     moduleName.startsWith("event-target-shim") &&
//     context.originModulePath.includes("react-native-webrtc")
//   ) {
//     // Resolve "event-target-shim" to v6 (for react-native-webrtc)
//     const eventTargetShimPath = resolveFrom(
//       context.originModulePath,
//       moduleName
//     );
    
//     console.log("Redirecting to event-target-shim v6 at:", eventTargetShimPath);
    
//     return {
//       filePath: eventTargetShimPath,
//       type: "sourceFile",
//     };
//   }

//   // Default resolver
//   return context.resolveRequest(context, moduleName, platform);
// };

// console.log("Applying NativeWind configuration");

// // Apply NativeWind configuration along with CSS handling
// module.exports = withNativeWind(config, { input: "./global.css" });

// console.log("Final config:", module.exports);


const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const resolveFrom = require("resolve-from");

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "event-target-shim" &&
    context.originModulePath.includes("react-native-webrtc")
  ) {
    const eventTargetShimPath = resolveFrom(
      context.originModulePath,
      "event-target-shim/index.js"
    );

    return {
      filePath: eventTargetShimPath,
      type: "sourceFile",
    };
  }

  // Default resolver
  return context.resolveRequest(context, moduleName, platform);
};

// Apply NativeWind configuration along with CSS handling
module.exports = withNativeWind(config, { input: "./global.css" });
