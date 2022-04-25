# Installation

This documentation covers how to install the AWS Proton plugins for Backstage into your Backstage application.

## Prerequisites

These instructions assume you already have a working Backstage application in which to install the plugins. If this is not the case, please refer to the Backstage [Getting Started](https://backstage.io/docs/getting-started/) documentation.

## AWS Credentials

The Proton backend plugin relies on the [default behavior of the AWS SDK for Javascript](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html) to determine the AWS credentials to use for authenticating to AWS APIs.

The Proton backend plugin running in your Backstage app will search for credentials in the following order:

1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
1. Shared credentials file (`~/.aws/credentials`)
1. Credentials loaded from the Amazon ECS credentials provider (if running in ECS)
1. Credentials loaded from the Amazon EC2 instance credentials provider (if running in EC2)

We do not recommend hard-coding your AWS credentials in your Backstage application configuration. Hard-coding credentials poses a risk of exposing your access key ID and secret access key.

## Backend Plugin

Install the AWS Proton backend plugin package in your Backstage app:

```
yarn workspace backend add @aws/aws-proton-backend-plugin-for-backstage
```

Create a new file `packages/backend/src/plugins/awsProton.ts` with the following file contents:

```typescript
import { createRouter } from '@aws/aws-proton-backend-plugin-for-backstage';
import { PluginEnvironment } from '../types';

export default async function createPlugin(env: PluginEnvironment) {
  return await createRouter({
    logger: env.logger,
  });
}
```

Edit `packages/backend/src/index.ts` to register the backend plugin:

```diff
diff --git a/packages/backend/src/index.ts b/packages/backend/src/index.ts
index 70bc66b..1e624ae 100644
--- a/packages/backend/src/index.ts
+++ b/packages/backend/src/index.ts
@@ -28,6 +28,7 @@ import scaffolder from './plugins/scaffolder';
 import proxy from './plugins/proxy';
 import techdocs from './plugins/techdocs';
 import search from './plugins/search';
+import awsProton from './plugins/awsProton';
 import { PluginEnvironment } from './types';
 import { ServerPermissionClient } from '@backstage/plugin-permission-node';

@@ -79,6 +80,7 @@ async function main() {
   const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
   const searchEnv = useHotMemoize(module, () => createEnv('search'));
   const appEnv = useHotMemoize(module, () => createEnv('app'));
+  const awsProtonEnv = useHotMemoize(module, () => createEnv('aws-proton-backend'));

   const apiRouter = Router();
   apiRouter.use('/catalog', await catalog(catalogEnv));
@@ -87,6 +89,7 @@ async function main() {
   apiRouter.use('/techdocs', await techdocs(techdocsEnv));
   apiRouter.use('/proxy', await proxy(proxyEnv));
   apiRouter.use('/search', await search(searchEnv));
+  apiRouter.use('/aws-proton-backend', await awsProton(awsProtonEnv));

   // Add backends ABOVE this line; this 404 handler is the catch-all fallback
   apiRouter.use(notFoundHandler());
```

Verify that the backend plugin is running in your Backstage app. You should receive `{"status":"ok"}` when accessing this URL:
`https://<your backstage app>/api/aws-proton-backend/health`.

## Frontend UI Plugin

Install the AWS Proton frontend UI plugin package in your Backstage app:

```
yarn workspace app add @aws/aws-proton-plugin-for-backstage
```

Edit `packages/app/src/components/catalog/EntityPage.tsx` to add the AWS Proton service overview entity card in the entity page layout.
For example, these changes would add the Proton entity card to the Overview tab for an entity:

```diff
diff --git a/packages/app/src/components/catalog/EntityPage.tsx b/packages/app/src/components/catalog/EntityPage.tsx
index 84d0944..34f6f58 100644
--- a/packages/app/src/components/catalog/EntityPage.tsx
+++ b/packages/app/src/components/catalog/EntityPage.tsx
@@ -43,10 +43,14 @@ import {
 } from '@backstage/plugin-catalog';
 import {
   isGithubActionsAvailable,
   EntityGithubActionsContent,
 } from '@backstage/plugin-github-actions';
+import {
+  EntityAWSProtonServiceOverviewCard,
+  isAWSProtonServiceAvailable,
+} from '@aws/aws-proton-plugin-for-backstage';
 import {
   EntityUserProfileCard,
   EntityGroupProfileCard,
   EntityMembersListCard,
   EntityOwnershipCard,
@@ -119,10 +123,18 @@ const overviewContent = (
   <Grid container spacing={3} alignItems="stretch">
     {entityWarningContent}
     <Grid item md={6}>
       <EntityAboutCard variant="gridItem" />
     </Grid>
+    <EntitySwitch>
+        <EntitySwitch.Case if={e => Boolean(isAWSProtonServiceAvailable(e))}>
+          <Grid item md={6}>
+            <EntityAWSProtonServiceOverviewCard />
+          </Grid>
+        </EntitySwitch.Case>
+    </EntitySwitch>
     <Grid item md={6} xs={12}>
       <EntityCatalogGraphCard variant="gridItem" height={400} />
     </Grid>

     <Grid item md={4} xs={12}>
```

## Software Templates Scaffolder Action

Edit `packages/backend/src/plugins/scaffolder.ts` to register the AWS Proton Create Service scaffolder action:

```diff
diff --git a/packages/backend/src/plugins/scaffolder.ts b/packages/backend/src/plugins/scaffolder.ts
index 7ce5fcf..e2f1362 100644
--- a/packages/backend/src/plugins/scaffolder.ts
+++ b/packages/backend/src/plugins/scaffolder.ts
@@ -2,6 +2,9 @@ import { CatalogClient } from '@backstage/catalog-client';
 import { createRouter } from '@backstage/plugin-scaffolder-backend';
 import { Router } from 'express';
 import type { PluginEnvironment } from '../types';
+import { ScmIntegrations } from '@backstage/integration';
+import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
+import { createAwsProtonServiceAction } from '@aws/aws-proton-backend-plugin-for-backstage';

 export default async function createPlugin(
   env: PluginEnvironment,
@@ -10,11 +13,23 @@ export default async function createPlugin(
     discoveryApi: env.discovery,
   });

+  const integrations = ScmIntegrations.fromConfig(env.config);
+
+  const builtInActions = createBuiltinActions({
+    integrations,
+    catalogClient,
+    reader: env.reader,
+    config: env.config,
+  });
+
+  const actions = [...builtInActions, createAwsProtonServiceAction()];
+
   return await createRouter({
     logger: env.logger,
     config: env.config,
     database: env.database,
     reader: env.reader,
     catalogClient,
+    actions,
   });
 }
```

Verify that the scaffolder action is successfully registered in your Backstage app.
You should see `aws:proton:create-service` in the list of installed scaffolder actions on the following page:
`https://<your backstage app>/create/actions`.