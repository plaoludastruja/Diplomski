# Expo commands (Poguzija)

Run all commands from the `Poguzija/` folder.

## Running the project

```bash
npx expo start              # starts the dev server (Expo Go / dev client)
npx expo start --android    # starts and opens on Android emulator/device
npx expo start --ios        # starts and opens on iOS simulator
npx expo start --web        # starts the web version
npx expo start -c           # starts with metro cache cleared (when something is acting weird)
npx expo start --tunnel     # starts using a tunnel (when the phone isn't on the same network)
```

Or via the npm scripts from `package.json`:

```bash
npm run start
npm run android
npm run ios
npm run web
```

## Installing packages

```bash
npx expo install <package-name>   # installs a package at a version compatible with the Expo SDK
npx expo install --check          # checks whether installed packages are compatible
npx expo install --fix            # automatically fixes incompatible package versions
```

## Checking the project

```bash
npx expo-doctor              # checks project health (versions, configuration)
npx expo config               # prints the resolved app config
npx expo config --type public # public version of the configuration
```

## Build (EAS)

```bash
npx eas login                       # log in to your Expo/EAS account
npx eas build:configure             # initial EAS configuration (eas.json)
npx eas build --platform android    # build for Android
npx eas build --platform ios        # build for iOS
npx eas build --platform all        # build for both platforms
npx eas build --profile preview     # build with the preview profile (internal testing)
npx eas build --profile development # dev-client build
```

## Update (EAS Update / OTA)

```bash
npx eas update --branch preview --message "change description"
npx eas update:configure
```

## Submit (EAS)

```bash
npx eas submit --platform android
npx eas submit --platform ios
```

## Native projects (prebuild)

```bash
npx expo prebuild              # generates the android/ and ios/ folders
npx expo prebuild --clean      # regenerates them from scratch
npx expo run:android           # builds + runs the native Android app (without Expo Go)
npx expo run:ios               # builds + runs the native iOS app
```

## Tests

```bash
npm test          # runs jest in watch mode (test script from package.json)
npx jest           # runs the tests once
```

## Other useful commands

```bash
npx expo install --check     # checks dependency compatibility
npx expo customize            # adds default config files (babel.config.js, metro.config.js, ...)
npx expo login                 # log in to your Expo account
npx expo whoami                 # currently logged-in user
```
