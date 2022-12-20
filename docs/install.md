# AWS Proton plugins for Backstage installation guide

This document covers the installation of the AWS Proton plugins for Backstage into your Backstage application.

<!-- toc -->

1. [Prerequisites](#prerequisites)
1. [AWS credentials](#aws-credentials)
1. [IAM permissions](#iam-permissions)
1. [Install the backend plugin](#install-the-backend-plugin)
1. [Install the frontend UI plugin](#install-the-frontend-ui-plugin)
1. [Install the Software Templates scaffolder action](#install-the-software-templates-scaffolder-action)
<!-- tocstop -->

## Prerequisites

These instructions assume you already have a working Backstage application that you can install the plugins in. If this isn't the case, refer to the Backstage [Getting Started](https://backstage.io/docs/getting-started/) documentation.

## AWS credentials

By default, the AWS Proton backend plugin relies on the [default behavior of the AWS SDK for Javascript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_credential_provider_node.html) to determine the AWS credentials that it uses to authenticate an identity to use with AWS APIs.

The AWS Proton backend plugin that runs in your Backstage app searches for credentials in the following order:

1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
1. SSO credentials from the token cache
1. Web identity token credentials (including running in an Amazon EKS cluster using IAM roles for service accounts)
1. Shared credentials and config ini files (`~/.aws/credentials`, `~/.aws/config`)
1. Amazon Elastic Container Service (Amazon ECS) task metadata service
1. Amazon Elastic Compute Cloud (Amazon EC2) instance metadata service

We recommend that you don't hard-code long lived AWS credentials in your production Backstage application configuration. Hard-coding credentials is risky and might expose your access key ID and secret access key.

Instead, we recommend that you use short lived AWS credentials for your production Backstage application by deploying it to Amazon ECS, Amazon Elastic Kubernetes Service (Amazon EKS), or Amazon EC2. For more information about deploying Backstage to Amazon EKS using a Helm chart or to Amazon ECS on AWS Fargate using the AWS Cloud Development Kit (CDK), see [Deploying Backstage](https://backstage.io/docs/deployment/) in the Backstage documentation.

To use multiple AWS accounts with your Backstage app or to explicitly configure credentials for an AWS account, you can configure AWS accounts in your Backstage app's configuration.
For example, to configure an AWS account to use with the AWS Proton backend plugin which requires using an IAM role to retrieve credentials, add the following to your Backstage app-config.yaml file.

```yaml
aws:
  accounts:
    - accountId: '111111111111'
      roleName: 'my-iam-role-name'
```

For more account configuration examples, see the [Backstage integration-aws-node package documentation](https://www.npmjs.com/package/@backstage/integration-aws-node).

## IAM permissions

The AWS Proton backend plugin requires the AWS identity that it uses to have the following IAM permissions for populating the Proton entity card:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["proton:GetService", "proton:ListServiceInstances"],
      "Resource": "*"
    }
  ]
}
```

The AWS Proton scaffolder action requires the AWS identity that it uses to have the following IAM permissions to create AWS Proton services:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "proton:CreateService",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "codestar-connections:PassConnection",
      "Resource": "arn:aws:codestar-connections:*:*:connection/*",
      "Condition": {
        "StringEquals": {
          "codestar-connections:PassedToService": "proton.amazonaws.com"
        }
      }
    }
  ]
}
```

Depending on how you configure the AWS Proton scaffolder action in your Backstage Software Templates, the AWS Proton scaffolder action permissions can also be further limited to specific AWS Proton service templates and CodeStar Connections connections:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "proton:CreateService",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "proton:ServiceTemplate": "arn:aws:proton:us-east-1:123456789012:service-template/my-service-template"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "codestar-connections:PassConnection",
      "Resource": "arn:aws:codestar-connections:us-east-1:123456789012:connection/c176b204-5bb1-48f1-b977-5aff4fa2df9d",
      "Condition": {
        "StringEquals": {
          "codestar-connections:PassedToService": "proton.amazonaws.com"
        }
      }
    }
  ]
}
```

## Install the backend plugin

Install the AWS Proton backend plugin package in your Backstage app:

```shell
yarn workspace backend add @aws/aws-proton-backend-plugin-for-backstage
```

Create a file `packages/backend/src/plugins/awsProton.ts` with the following content:

```typescript
import { createRouter } from '@aws/aws-proton-backend-plugin-for-backstage';
import { PluginEnvironment } from '../types';

export default async function createPlugin(env: PluginEnvironment) {
  return await createRouter({
    logger: env.logger,
    config: env.config,
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

## Install the frontend UI plugin

Install the AWS Proton frontend UI plugin package in your Backstage app:

```shell
yarn workspace app add @aws/aws-proton-plugin-for-backstage
```

Edit `packages/app/src/components/catalog/EntityPage.tsx` to add the AWS Proton service overview entity card in the entity page layout.
For example, the following changes add the Proton entity card to the **Overview** tab for an entity:

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

## Install the Software Templates scaffolder action

Edit `packages/backend/src/plugins/scaffolder.ts` to register the AWS Proton **Create Service** scaffolder action:

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
+  const actions = [...builtInActions, createAwsProtonServiceAction({ config: env.config })];
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
