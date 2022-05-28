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

import { DeploymentStatus, Service, ServiceInstanceSummary, ServiceStatus } from "@aws-sdk/client-proton";
import { Entity } from "@backstage/catalog-model";
import { AwsProtonApi } from "../api";

export class MockProtonService implements AwsProtonApi {

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

export class MockMegaService implements AwsProtonApi {

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

export class MockProtonServiceCreateInProgress implements AwsProtonApi {

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

export class MockProtonServiceNoPipeline implements AwsProtonApi {

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

export class MockGetServiceAPIError implements AwsProtonApi {

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

export class MockListServiceInstancesAPIError implements AwsProtonApi {

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

export class MockSlowLoad implements AwsProtonApi {

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


export const mockEntity: Entity = {
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

export const invalidEntity: Entity = {
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