export default {
  expo: {
    name: "Poguzija",
    slug: "Poguzija",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/iconTest1.png",
    scheme: "myapp",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splashTest1.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.plaoludastruja.poguzija"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.plaoludastruja.poguzija",
      googleServicesFile: process.env.GOOGLE_SERVICE_JSON
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "@react-native-google-signin/google-signin",
      "expo-font",
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "990d7876-9a02-4fa0-9a71-75918414f1d9"
      }
    }
  }
}
