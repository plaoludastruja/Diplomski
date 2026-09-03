# Expo commands (Poguzija)

Run all commands from the `Poguzija/` folder.

## Running the project

```bash
npx expo start              # starts the dev server (Expo Go / dev client)
npx expo start -c           # starts with metro cache cleared (when something is acting weird)
npx expo start --android    # starts and opens on Android emulator/device
npx expo start --ios        # starts and opens on iOS simulator
npx expo start --web        # starts the web version
npx expo start --tunnel     # starts using a tunnel (when the phone isn't on the same network)
npx expo lint
```

Or via the npm scripts from `package.json`:

```bash
npm run start
npm run startc
npm run android
npm run ios
npm run web
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
eas build --profile development --platform android
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

## Other useful commands

```bash
npx expo customize             # adds default config files (babel.config.js, metro.config.js, ...)
npx expo login                 # log in to your Expo account
npx expo whoami                # currently logged-in user
```

## Upgrading Expo

```bash
npx expo install expo@latest   # updates the expo package to the newest SDK
npx expo install --check       # lists which packages are out of date, without installing anything
npx expo install --fix         # aligns all other packages to versions compatible with that SDK
npm update                     # updates every dependency within its current package.json range
npx expo-doctor                # checks project health after the upgrade
```
