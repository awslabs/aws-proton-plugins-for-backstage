/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { configApiRef, createApiFactory, 
  createComponentExtension, 
  createPlugin, 
  identityApiRef, } from '@backstage/core-plugin-api';
import { AwsProtonApiClient, awsProtonApiRef } from './api';
import { AWS_PROTON_SERVICE_ANNOTATION } from './constants';
import { Entity } from '@backstage/catalog-model';

import { rootRouteRef } from './routes';

export const isAWSProtonServiceAvailable = (entity: Entity) =>
  entity?.metadata.annotations?.[AWS_PROTON_SERVICE_ANNOTATION];

export const awsProtonPlugin = createPlugin({
  id: 'aws-proton',
  
  apis: [
    createApiFactory({
      api: awsProtonApiRef,
      deps: { configApi: configApiRef, identityApi: identityApiRef },
      factory: ({ configApi, identityApi }) =>
        new AwsProtonApiClient({ configApi, identityApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const EntityAWSProtonServiceOverviewCard = awsProtonPlugin.provide(
  createComponentExtension({
    name: 'EntityAWSLambdaOverviewCard',
    component: {
      lazy: () =>
        import('./components/AWSProtonServiceOverview/AWSProtonServiceOverview').then(
          m => m.AWSProtonServiceOverviewWidget,
        ),
    },
  }),
);
