# Developing with the AWS Proton plugins for Backstage

Learn how to develop locally with the AWS Proton plugins for Backstage.

To initialize the AWS Proton plugin packages:

```shell
yarn install
yarn ci
```

## Test standalone

The easiest way you can develop and test with the AWS Proton plugins in your local environment is to run the plugins in standalone mode.

You can run the backend plugin this way:

```shell
yarn start:backend
```

And the frontend plugin this way:

```shell
yarn start:frontend
```

## Test in a local Backstage app

To develop and test with the AWS Proton plugins in a local Backstage app:

1. Initialize the packages like in the standalone case by running `yarn install` and `yarn ci`.  Then, follow the main [Backstage instructions](https://backstage.io/docs/getting-started/create-an-app) to create and run a Backstage app locally.  We recommend that you create a git repository for your personal Backstage app, so that you can use version control for your modifications.  After you create the app, go into the app's root directory and run `git init`.

1. Follow the [AWS Proton plugins for Backstage installation guide](install.md) to install the AWS Proton plugins into your local Backstage app.  You need to slightly modify the guide's instructions: don't run the `yarn workspace backend add...` or `yarn workspace app add...` steps of the guide.  Instead, copy the plugin source code into your Backstage app:

    ```shell
    $ cp -rf ./aws-proton-plugins-for-backstage/plugins/* ./my-personal-backstage-app/plugins/
    ```

1. Manually add the AWS Proton plugin dependencies to the 'app' and 'backend' workspaces and configure them to point to the local plugin code:

    ```diff
    diff --git a/packages/app/package.json b/packages/app/package.json
    index 5509d17..5bf347a 100644
    --- a/packages/app/package.json
    +++ b/packages/app/package.json
    @@ -7,6 +7,7 @@
        "role": "frontend"
      },
      "dependencies": {
    +    "@aws/aws-proton-plugin-for-backstage": "link:../../plugins/aws-proton",
        "@backstage/app-defaults": "^1.0.1",
        "@backstage/catalog-model": "^1.0.1",
        "@backstage/cli": "^0.17.0",
    diff --git a/packages/backend/package.json b/packages/backend/package.json
    index 8e7730c..de90e48 100644
    --- a/packages/backend/package.json
    +++ b/packages/backend/package.json
    @@ -16,6 +16,7 @@
        "build-image": "docker build ../.. -f Dockerfile --tag backstage"
      },
      "dependencies": {
    +    "@aws/aws-proton-backend-plugin-for-backstage": "link:../../plugins/aws-proton-backend",
        "app": "link:../app",
        "@backstage/backend-common": "^0.13.2",
        "@backstage/backend-tasks": "^0.3.0",
    ```

1. Run `yarn install` to set up the appropriate links to the local plugin code.  Follow the rest of the instructions in the installation guide, like editing files to hook the plugins into your Backstage app frontend and backend.

After everything is installed in your local Backstage app, verify the following:
1. You see `aws:proton:create-service` in the list of installed scaffolder actions on http://localhost:7007/create/actions.
2. The backend plugin is running: http://localhost:7007/api/aws-proton-backend/health. You should receive `{"status":"ok"}`.

> **Note**
>
> Each time you make a code change to the plugins, you need to re-build them (by running `yarn ci`) and copy them again to your local Backstage app.

To learn how to use the plugins in your Backstage app, see [Tutorial: using the AWS Proton plugins for Backstage](tutorial.md)  .
