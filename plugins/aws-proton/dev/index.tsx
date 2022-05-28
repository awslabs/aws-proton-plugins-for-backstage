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

import { createDevApp } from '@backstage/dev-utils';
import { awsProtonApiRef } from '../src/api';
import { awsProtonPlugin, EntityAWSProtonServiceOverviewCard } from '../src/plugin';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { 
  invalidEntity,
  mockEntity, 
  MockGetServiceAPIError, 
  MockListServiceInstancesAPIError, 
  MockMegaService, 
  MockProtonService, 
  MockProtonServiceCreateInProgress, 
  MockProtonServiceNoPipeline,
  MockSlowLoad
} from '../src/mocks';

createDevApp()
  .addPage({
    path: '/fixture-proton-service',
    title: 'Service',
    element: (
      <TestApiProvider
        apis={[[awsProtonApiRef, new MockProtonService()]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityAWSProtonServiceOverviewCard />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-mega-proton-service',
    title: 'Mega Service',
    element: (
      <TestApiProvider
        apis={[[awsProtonApiRef, new MockMegaService()]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityAWSProtonServiceOverviewCard />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-proton-service-create-in-progress',
    title: 'Create In Progress',
    element: (
      <TestApiProvider
        apis={[[awsProtonApiRef, new MockProtonServiceCreateInProgress()]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityAWSProtonServiceOverviewCard />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-proton-service-no-pipeline',
    title: 'No Pipeline',
    element: (
      <TestApiProvider
        apis={[[awsProtonApiRef, new MockProtonServiceNoPipeline()]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityAWSProtonServiceOverviewCard />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-invalid-annotation',
    title: 'Bad Annotation',
    element: (
      <TestApiProvider
        apis={[[awsProtonApiRef, new MockProtonService()]]}
      >
        <EntityProvider entity={invalidEntity}>
          <EntityAWSProtonServiceOverviewCard />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-proton-service-get-service-api-error',
    title: 'GetService Error',
    element: (
      <TestApiProvider
        apis={[[awsProtonApiRef, new MockGetServiceAPIError()]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityAWSProtonServiceOverviewCard />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-proton-service-list-service-instances-api-error',
    title: 'ListServiceInstances Error',
    element: (
      <TestApiProvider
        apis={[[awsProtonApiRef, new MockListServiceInstancesAPIError()]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityAWSProtonServiceOverviewCard />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-slow-load',
    title: 'Slow Load',
    element: (
      <TestApiProvider
        apis={[[awsProtonApiRef, new MockSlowLoad()]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityAWSProtonServiceOverviewCard />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .registerPlugin(awsProtonPlugin)
  .render();
