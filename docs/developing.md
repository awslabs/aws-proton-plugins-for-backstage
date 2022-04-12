# Developing

To initialize the packages:

```
yarn install
yarn bootstrap
yarn tsc
yarn build
yarn link-packages
```

## Test standalone

The easiest way to develop and test locally is to run the plugins in standalone mode.

You can run the backend plugin like so:

```
yarn start:backend
```

And the frontend plugin like so:

```
yarn start:frontend
```

## Test in a Backstage App

Follow the main [Backstage instructions](https://backstage.io/docs/getting-started/create-an-app) to create and run a Backstage app locally.  It is recommended to create a git repository for your personal Backstage app, so that you can version-control your modifications.  After creating the app, go into the app's root directory and run `git init`.

Next, follow the [Proton plugin installation instructions](install.md) to install the Proton plugins into your local Backstage app.  However, you will need to slightly modify the instructions:

1. Replace the frontend and backend package names in all the install steps. This is a temporary step until we settle on a final name for these plugins.  For the frontend plugin, replace `@aws/aws-proton-plugin-for-backstage` with `@internal/plugin-aws-proton`. For the backend plugin, replace `@aws/aws-proton-backend-plugin-for-backstage` with `@internal/plugin-aws-proton-backend`.
1. Link your local Proton plugin code into your local Backstage app.  Instead of running `yarn workspace backend add...` or `yarn workspace app add...` from the install instructions, run `yarn workspace backend link @internal/plugin-aws-proton-backend` and `yarn workspace app link @internal/plugin-aws-proton` instead.

After everything is installed in your local Backstage app, verify the following:
1. You see `aws:proton:create-service` in the list of installed scaffolder actions on http://localhost:7007/create/actions.
2. The backend plugin is running: http://localhost:7007/api/aws-proton-backend/health. You should receive `{"status":"ok"}`.
