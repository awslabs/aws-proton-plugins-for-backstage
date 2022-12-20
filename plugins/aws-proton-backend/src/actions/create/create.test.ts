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

import mockFs from 'mock-fs';

import { PassThrough } from 'stream';
import os from 'os';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  AwsCredentialProvider,
  AwsCredentialProviderOptions,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import { createAwsProtonServiceAction } from '.';
import { CreateServiceCommand, ProtonClient } from '@aws-sdk/client-proton';
import { mockClient } from 'aws-sdk-client-mock';
import { resolve as resolvePath } from 'path';

function getMockCredentialProvider(): Promise<AwsCredentialProvider> {
  return Promise.resolve({
    sdkCredentialProvider: async () => {
      return Promise.resolve({
        accessKeyId: 'MY_ACCESS_KEY_ID',
        secretAccessKey: 'MY_SECRET_ACCESS_KEY',
      });
    },
  });
}
const credsProviderMock = jest.spyOn(
  DefaultAwsCredentialsManager.prototype,
  'getCredentialProvider',
);

const protonMock = mockClient(ProtonClient);

const root = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';
const workspacePath = resolvePath(root, 'my-workspace');

describe('aws:proton:create-service', () => {
  const mockContext = {
    workspacePath,
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();

    credsProviderMock.mockImplementation((_?: AwsCredentialProviderOptions) =>
      getMockCredentialProvider(),
    );

    protonMock.reset();

    protonMock.on(CreateServiceCommand).resolves({
      service: {
        arn: 'arn:aws:proton:us-west-2:1234567890:service/test',
        name: 'test',
        templateName: 'mock-template',
        createdAt: new Date(),
        lastModifiedAt: new Date(),
        status: 'ACTIVE',
        spec: 'asdasd',
      },
    });

    mockFs({
      [workspacePath]: {
        'spec.yaml': 'dummy',
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should call AWS Proton API', async () => {
    const action = createAwsProtonServiceAction({
      config: new ConfigReader({}),
    });
    await action.handler({
      ...mockContext,
      input: {
        serviceName: 'serviceName',
        branchName: 'main',
        region: 'us-west-2',
        repository: 'repository',
        repositoryConnectionArn: 'arn:mock',
        serviceSpecPath: './spec.yaml',
        templateMajorVersion: '1',
        templateName: 'template',
      },
    });

    expect(protonMock.send.getCall(0).args[0].input).toMatchObject({
      name: 'serviceName',
      spec: 'dummy',
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'arn',
      'arn:aws:proton:us-west-2:1234567890:service/test',
    );
  });

  it('should call AWS Proton API in a specific account', async () => {
    const action = createAwsProtonServiceAction({
      config: new ConfigReader({}),
    });

    await action.handler({
      ...mockContext,
      input: {
        serviceName: 'serviceName',
        branchName: 'main',
        region: 'us-west-2',
        repository: 'repository',
        repositoryConnectionArn: 'arn:mock',
        serviceSpecPath: './spec.yaml',
        templateMajorVersion: '1',
        templateName: 'template',
        accountId: '1234567890',
      },
    });

    expect(credsProviderMock).toHaveBeenCalledWith({ accountId: '1234567890' });
  });
});
