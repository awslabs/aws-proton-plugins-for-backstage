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

import { Logger } from 'winston';
import { GetServiceCommand, ProtonClient, Service, ServiceInstanceSummary, paginateListServiceInstances } from '@aws-sdk/client-proton';
import { parse } from '@aws-sdk/util-arn-parser'

export class AwsProtonApi {
  public constructor(
    private readonly logger: Logger,
  ) {}

  public async getProtonService(
    arn: string,
  ): Promise<Service> {
    this.logger?.debug(
      `Fetch Proton Service ${arn}`,
    );

    const {region, resource} = parse(arn);
    const segments = resource.split("/");
    if (segments.length < 2) throw new Error("Malformed Proton Service ARN");

    const serviceName = segments[1];

    const client = new ProtonClient({
      region: region,
      customUserAgent: 'aws-proton-plugin-for-backstage',
    });
    const resp = await client
      .send(new GetServiceCommand({
        name: serviceName
      }));
    return resp.service!;
  }

  public async listProtonServiceInstances(
    arn: string,
  ): Promise<ServiceInstanceSummary[]> {
    this.logger?.debug(
      `Fetch Proton Service ${arn}`,
    );

    const {region, resource} = parse(arn);
    const segments = resource.split("/");
    if (segments.length < 2) throw new Error("Malformed Proton Service ARN");

    const serviceName = segments[1];

    const client = new ProtonClient({
      region: region,
      customUserAgent: 'aws-proton-plugin-for-backstage',
    });
    const serviceInstances: ServiceInstanceSummary[] = [];
    for await (const page of paginateListServiceInstances({ client }, { serviceName })) {
      if (page.serviceInstances) {
        serviceInstances.push(...page.serviceInstances);
      }
    }
    return serviceInstances;
  }
}