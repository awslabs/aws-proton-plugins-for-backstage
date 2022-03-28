# Developing

The easiest way to develop and test locally is to run the plugins in standalone mode.

To initialize the packages:

```
yarn install
yarn bootstrap
yarn tsc
yarn build
```

You can run the backend plugin like so:

```
yarn start:backend
```

And the frontend plugin like so:

```
yarn start:frontend
```

### Testing Backstage App

Currently the mechanism used to test the plugins in a full Backstage app is to copy the plugin packages to:

```
<backstage app root>/plugins
```