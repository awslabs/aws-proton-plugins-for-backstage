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

import { GetServiceCommand, ProtonClient } from '@aws-sdk/client-proton';
import { getVoidLogger } from '@backstage/backend-common';
import {
  AwsCredentialProvider,
  AwsCredentialProviderOptions,
  AwsCredentialsManager,
} from '@backstage/integration-aws-node';
import { mockClient } from 'aws-sdk-client-mock';
import { AwsProtonApi } from './AwsProtonApi';

const protonMock = mockClient(ProtonClient);
let awsCredentialsManager: AwsCredentialsManager;

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

describe('AwsProtonApi', () => {
  beforeEach(() => {
    protonMock.reset();

    awsCredentialsManager = {
      getCredentialProvider: jest.fn((_: AwsCredentialProviderOptions) =>
        getMockCredentialProvider(),
      ),
    };
  });

  it('returns service', async () => {
    protonMock.on(GetServiceCommand).resolves({
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

    const client = new AwsProtonApi(getVoidLogger(), awsCredentialsManager);

    const service = await client.getProtonService(
      'arn:aws:proton:us-west-2:1234567890:service/test',
    );

    expect(service.name).toEqual('test');

    expect(awsCredentialsManager.getCredentialProvider).toHaveBeenCalledWith({
      arn: 'arn:aws:proton:us-west-2:1234567890:service/test',
    });
  });
});
