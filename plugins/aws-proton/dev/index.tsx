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
import { Entity } from '@backstage/catalog-model';
import { AwsProtonApi, awsProtonApiRef } from '../src/api';
import { awsProtonPlugin, EntityAWSProtonServiceOverviewCard } from '../src/plugin';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { DeploymentStatus, Service, ServiceInstanceSummary } from '@aws-sdk/client-proton';

class MockAwsProtonApi implements AwsProtonApi {

  async getService({ arn, }: { arn: string; }): Promise<Service> {
    return {
      arn: arn,
      name: 'mock-service',
      templateName: 'mock-template',
      createdAt: new Date(),
      lastModifiedAt: new Date(),
      status: 'ACTIVE',
      spec: 'asdasd',
      pipeline: {
        arn: 'aasdasd',
        createdAt: new Date(),
        lastDeploymentAttemptedAt: new Date(),
        lastDeploymentSucceededAt: new Date(),
        deploymentStatus: 'SUCCEEDED',
        templateName: 'mock-template',
        templateMajorVersion: '1',
        templateMinorVersion: '0'
      }
    }
  }

  async listServiceInstances({ arn, }: { arn: string; }): Promise<ServiceInstanceSummary[]> {
    return [{
      arn: 'dummy1',
      name: 'mock-instance1',
      lastDeploymentAttemptedAt: new Date(),
      lastDeploymentSucceededAt: new Date(),
      templateName: 'mock-template',
      createdAt: new Date(),
      serviceName: 'mock-service',
      deploymentStatus: DeploymentStatus.SUCCEEDED,
      environmentName: 'dev',
      templateMajorVersion: '1',
      templateMinorVersion: '0'
    },{
      arn: 'dummy2',
      name: 'mock-instance2',
      lastDeploymentAttemptedAt: new Date(),
      lastDeploymentSucceededAt: new Date(),
      templateName: 'mock-template',
      createdAt: new Date(),
      serviceName: 'mock-service',
      deploymentStatus: DeploymentStatus.IN_PROGRESS,
      environmentName: 'prod',
      templateMajorVersion: '1',
      templateMinorVersion: '0'
    }]
  }
}

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
    annotations: {
      'aws.amazon.com/aws-proton-service': 'arn:aws:proton:us-west-2:1234567890:service/mock-service',
    },
  },
  spec: {
    lifecycle: 'production',
    type: 'service',
    owner: 'user:guest',
  },
};

createDevApp()
  .addPage({
    path: '/fixture-1',
    title: 'Fixture 1',
    element: (
      <TestApiProvider
        apis={[[awsProtonApiRef, new MockAwsProtonApi()]]}
      >
        <EntityProvider entity={mockEntity}>
          <EntityAWSProtonServiceOverviewCard />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .registerPlugin(awsProtonPlugin)
  .render();
