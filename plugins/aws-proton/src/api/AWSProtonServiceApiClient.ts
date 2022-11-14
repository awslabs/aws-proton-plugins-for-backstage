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

import { IdentityApi } from '@backstage/core-plugin-api';

import { ConfigApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { Service, ServiceInstanceSummary } from '@aws-sdk/client-proton';
import { AwsProtonApi } from '.';

export class AwsProtonApiClient implements AwsProtonApi {
  private readonly configApi: ConfigApi;
  private readonly identityApi: IdentityApi;

  public constructor(options: {
    configApi: ConfigApi;
    identityApi: IdentityApi;
  }) {
    this.configApi = options.configApi;
    this.identityApi = options.identityApi;
  }

  async getService({ arn }: { arn: string }): Promise<Service> {
    const queryString = new URLSearchParams();
    queryString.append('arn', arn);

    const urlSegment = `service?${queryString}`;

    const service = await this.get<Service>(urlSegment);

    return service;
  }

  async listServiceInstances({
    arn,
  }: {
    arn: string;
  }): Promise<ServiceInstanceSummary[]> {
    const queryString = new URLSearchParams();
    queryString.append('arn', arn);

    const urlSegment = `serviceInstances?${queryString}`;

    const service = await this.get<ServiceInstanceSummary[]>(urlSegment);

    return service;
  }

  private async get<T>(path: string): Promise<T> {
    const baseUrl = `${await this.configApi.getString(
      'backend.baseUrl',
    )}/api/aws-proton-backend/}`;

    const url = new URL(path, baseUrl);

    const { token: idToken } = await this.identityApi.getCredentials();

    const response = await fetch(url.toString(), {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }
}
