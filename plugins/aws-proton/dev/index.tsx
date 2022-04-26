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
import { DeploymentStatus, Service, ServiceInstanceSummary, ServiceStatus } from '@aws-sdk/client-proton';

class MockProtonService implements AwsProtonApi {

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
      arn: arn,
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
      arn: arn,
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

class MockMegaService implements AwsProtonApi {

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
    return Array.from({ length: 50 }, (_, i) => {
      return {
        arn: arn,
        name: `mock-instance-${i+1}`,
        lastDeploymentAttemptedAt: new Date(),
        lastDeploymentSucceededAt: new Date(),
        templateName: 'mock-template',
        createdAt: new Date(),
        serviceName: 'mock-service',
        deploymentStatus: DeploymentStatus.SUCCEEDED,
        environmentName: 'dev',
        templateMajorVersion: '1',
        templateMinorVersion: '0'
      }
    })
  }
}

class MockProtonServiceCreateInProgress implements AwsProtonApi {

  async getService({ arn, }: { arn: string; }): Promise<Service> {
    return {
      arn: arn,
      name: 'mock-service',
      templateName: 'mock-template',
      createdAt: new Date(),
      lastModifiedAt: new Date(),
      status: ServiceStatus.CREATE_IN_PROGRESS,
      spec: 'asdasd',
      pipeline: {
        arn: 'aasdasd',
        createdAt: new Date(),
        lastDeploymentAttemptedAt: new Date(),
        lastDeploymentSucceededAt: undefined,
        deploymentStatus: DeploymentStatus.IN_PROGRESS,
        templateName: 'mock-template',
        templateMajorVersion: undefined,
        templateMinorVersion: undefined
      }
    }
  }

  async listServiceInstances({ arn, }: { arn: string; }): Promise<ServiceInstanceSummary[]> {
    return [{
      arn: arn,
      name: 'mock-instance1',
      lastDeploymentAttemptedAt: new Date(),
      lastDeploymentSucceededAt: undefined,
      templateName: 'mock-template',
      createdAt: new Date(),
      serviceName: 'mock-service',
      deploymentStatus: DeploymentStatus.IN_PROGRESS,
      environmentName: 'dev',
      templateMajorVersion: undefined,
      templateMinorVersion: undefined
    },{
      arn: arn,
      name: 'mock-instance2',
      lastDeploymentAttemptedAt: new Date(),
      lastDeploymentSucceededAt: undefined,
      templateName: 'mock-template',
      createdAt: new Date(),
      serviceName: 'mock-service',
      deploymentStatus: DeploymentStatus.IN_PROGRESS,
      environmentName: 'prod',
      templateMajorVersion: undefined,
      templateMinorVersion: undefined
    }]
  }
}

class MockProtonServiceNoPipeline implements AwsProtonApi {

  async getService({ arn, }: { arn: string; }): Promise<Service> {
    return {
      arn: arn,
      name: 'mock-service',
      templateName: 'mock-template',
      createdAt: new Date(),
      lastModifiedAt: new Date(),
      status: 'ACTIVE',
      spec: 'asdasd'
    }
  }

  async listServiceInstances({ arn, }: { arn: string; }): Promise<ServiceInstanceSummary[]> {
    return [{
      arn: arn,
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
      arn: arn,
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

class MockGetServiceAPIError implements AwsProtonApi {

  async getService({ arn, }: { arn: string; }): Promise<Service> {
    throw new Error(`Could not find ${ arn }!`)
  }

  async listServiceInstances({ arn, }: { arn: string; }): Promise<ServiceInstanceSummary[]> {
    return [{
      arn: arn,
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
    }]
  }
}

class MockListServiceInstancesAPIError implements AwsProtonApi {

  async getService({ arn, }: { arn: string; }): Promise<Service> {
    return {
      arn: arn,
      name: 'mock-service',
      templateName: 'mock-template',
      createdAt: new Date(),
      lastModifiedAt: new Date(),
      status: 'ACTIVE',
      spec: 'asdasd'
    }
  }

  async listServiceInstances({ arn, }: { arn: string; }): Promise<ServiceInstanceSummary[]> {
    throw new Error(`Access denied to ${ arn }!`)
  }
}

class MockSlowLoad implements AwsProtonApi {

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
    await new Promise(f => setTimeout(f, 5000));
    return [{
      arn: arn,
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

const invalidEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
    annotations: {
      'aws.amazon.com/aws-proton-service': 'mock-service',
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
