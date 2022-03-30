# Usage

This documentation covers how to use the AWS Proton plugins for Backstage.

## Prerequisites

These instructions assumes you already have a working Backstage application in which to install the plugins. If this is not the case, please refer to the Backstage [Getting Started](https://backstage.io/docs/getting-started/) documentation.

## AWS Authentication

Currently the plugins inherit AWS IAM credentials from the context in which its run.

## Installation

### Backend

Install the backend plugin:

```
cd packages/backend && yarn add @aws/aws-proton-backend-plugin-for-backstage
```

Create `packages/backend/src/plugins/awsProton.ts` with the following file contents:

```typescript
import { createRouter } from '@aws/aws-proton-backend-plugin-for-backstage';
import { PluginEnvironment } from '../types';

export default async function createPlugin(env: PluginEnvironment) {
  return await createRouter({
    logger: env.logger,
  });
}
```

Edit `packages/backend/src/index.ts` and add appropriate entries to expose the backend plugin, you can use the following content as a guide:

```typescript
import awsProton from './plugins/awsProton'; // Add import
// ...
async function main() { // This is just for guidance, don't add it
  // ...
  const awsProtonEnv = useHotMemoize(module, () => createEnv('aws-proton-backend'));      // Add env
  apiRouter.use('/aws-proton-backend', await awsProton(awsProtonEnv));  // Add router plug
```

### Frontend

Install the frontend plugin:

```
cd packages/app && yarn add @aws/aws-proton-plugin-for-backstage
```

## AWS Proton Create Service Scaffolder Action

The `aws:create-proton-service` scaffolder action allows Backstage templates to create a AWS Proton service for new components.

The action makes the following assumptions:
- AWS Proton service templates are maintained separately
- AWS Proton environments have already been created
- Appropriate AWS Proton repository connections have been configured

To add the scaffolder action edit `packages/backend/src/plugins/scaffolder.ts` so it looks something like this:

```typescript
import { DockerContainerRunner } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import Docker from 'dockerode';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { ScmIntegrations } from '@backstage/integration';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { createAwsProtonServiceAction } from '@aws/aws-proton-backend-plugin-for-backstage'; // Import the action

export default async function createPlugin({
  logger,
  config,
  database,
  reader,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  const integrations = ScmIntegrations.fromConfig(config);

  const builtInActions = createBuiltinActions({
    containerRunner,
    integrations,
    config,
    catalogClient,
    reader,
  });

  const actions = [...builtInActions, createAwsProtonServiceAction()]; // Add the action to the built-in actions

  return await createRouter({
    containerRunner,
    logger,
    config,
    database,
    catalogClient,
    reader,
    actions,
  });
}
```

To use the custom action in a template you can add a step similar to the following:

```yaml
spec:
  [...]
  steps:
    [...]
    - id: proton
      name: Create Proton Service
      action: aws:create-proton-service
      input:
        serviceName: ${{ parameters.component_id }}
        templateName: my-proton-template
        templateMajorVersion: '1'
        repository: ${{ parameters.repoUrl | parseRepoUrl }}
        branchName: main
        repositoryConnectionArn: 'arn:aws:codestar-connections:us-west-2:1234567890:connection/4dde5c82-51d6-4ea9-918e-03aed6971ff3'
        serviceSpecPath: service_spec.yml
```

## AWS Proton Entity Card

The `EntityAWSProtonServiceOverviewCard` component provides an entity card with an overview of an existing AWS Proton service.

To add the entity card edit `packages/app/src/components/catalog/EntityPage.tsx` and add the appropriate entries for where you want the card to be placed in the layout. You can use the following content as a guide for what goes where:

```typescript
import {
  EntityAWSProtonServiceOverviewCard,
  isAWSProtonServiceAvailable,
} from '@aws/aws-proton-plugin-for-backstage';
// ...
const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    {entityWarningContent}
    <Grid item md={6}>
      <EntityAboutCard variant="gridItem" />
    </Grid>
    // New entry starts here
    <EntitySwitch>
        <EntitySwitch.Case if={e => Boolean(isAWSProtonServiceAvailable(e))}>
          <Grid item md={6}>
            <EntityAWSProtonServiceOverviewCard />
          </Grid>
        </EntitySwitch.Case>
    </EntitySwitch>
    // New entry ends here
    <Grid item md={6} xs={12}>
      <EntityCatalogGraphCard variant="gridItem" height={400} />
    </Grid>

    <Grid item md={4} xs={12}>
      <EntityLinksCard />
    </Grid>
    <Grid item md={8} xs={12}>
      <EntityHasSubcomponentsCard variant="gridItem" />
    </Grid>
  </Grid>
);
```

You can now annotate a component like so:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: [...]
  annotations:
    [...]
    aws.com/proton-service: arn:aws:proton:us-west-2:1234567890:service/my-proton-service
spec:
  [...]
```