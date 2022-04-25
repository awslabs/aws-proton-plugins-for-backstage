# Developing

To initialize the packages:

```
yarn install
yarn ci
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

Next, follow the [Proton plugin installation instructions](install.md) to install the Proton plugins into your local Backstage app.  However, you will need to slightly modify the instructions.  Instead of running `yarn workspace backend add...` or `yarn workspace app add...` from the install instructions, manually add the dependencies to those workspaces' package.json files and point them to your local checkout of the Proton plugins (example below).  Then run `yarn install`.

```diff
diff --git a/packages/app/package.json b/packages/app/package.json
index 5509d17..5bf347a 100644
--- a/packages/app/package.json
+++ b/packages/app/package.json
@@ -7,6 +7,7 @@
     "role": "frontend"
   },
   "dependencies": {
+    "@aws/aws-proton-plugin-for-backstage": "link:../../../aws-proton-plugins-for-backstage/plugins/aws-proton",
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
+    "@aws/aws-proton-backend-plugin-for-backstage": "link:../../../aws-proton-plugins-for-backstage/plugins/aws-proton-backend",
     "app": "link:../app",
     "@backstage/backend-common": "^0.13.2",
     "@backstage/backend-tasks": "^0.3.0",
```

After everything is installed in your local Backstage app, verify the following:
1. You see `aws:proton:create-service` in the list of installed scaffolder actions on http://localhost:7007/create/actions.
2. The backend plugin is running: http://localhost:7007/api/aws-proton-backend/health. You should receive `{"status":"ok"}`.
