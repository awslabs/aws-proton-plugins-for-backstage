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

import { Config } from '@backstage/config';
import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { CreateServiceCommand, ProtonClient } from '@aws-sdk/client-proton';
import { AwsCredentialsManager, DefaultAwsCredentialsManager } from '@backstage/integration-aws-node';
import fs from 'fs-extra';

export function createAwsProtonServiceAction(options: { config: Config, awsCredentialsManager?: AwsCredentialsManager }) {
  const { config } = options;
  const awsCredentialsManager = options.awsCredentialsManager || DefaultAwsCredentialsManager.fromConfig(config);
  return createTemplateAction<{
    serviceName: string;
    templateName: string;
    templateMajorVersion: string;
    repository?: any;
    repositoryConnectionArn?: string;
    branchName?: string;
    serviceSpecPath: string;
    region: string;
    accountId?: string;
  }>({
    id: 'aws:proton:create-service',
    schema: {
      input: {
        required: [
          'serviceName',
          'templateName',
          'templateMajorVersion',
          'serviceSpecPath',
          'region',
        ],
        type: 'object',
        properties: {
          serviceName: {
            type: 'string',
            title: 'Service name',
            description: 'The name of the AWS Proton service',
          },
          templateName: {
            type: 'string',
            title: 'Service template name',
            description: 'The name of the AWS Proton service template',
          },
          templateMajorVersion: {
            type: 'string',
            title: 'Service template major version',
            description: 'The major version of the AWS Proton service template',
          },
          repository: {
            type: 'object',
            title: 'Source code repository',
            description: 'The source code repository',
          },
          repositoryConnectionArn: {
            type: 'string',
            title: 'Repository connection ARN',
            description: 'The AWS CodeStar Connections connection ARN',
          },
          branchName: {
            type: 'string',
            title: 'Branch name',
            description: 'The source repository branch',
          },
          serviceSpecPath: {
            type: 'string',
            title: 'Service specification',
            description:
              'The filesystem path to the AWS Proton service specification',
          },
          region: {
            type: 'string',
            title: 'AWS region',
            description: 'The AWS region',
          },
          accountId: {
            type: 'string',
            title: 'AWS account ID',
            description: 'The AWS account ID',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          arn: {
            title: 'ARN of the Proton service created',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const spec = await fs.readFile(
        `${ctx.workspacePath}/${ctx.input.serviceSpecPath}`,
      );

      ctx.logger.info(`Creating AWS Proton service ${ctx.input.serviceName}`);

      const creds = await awsCredentialsManager.getCredentialProvider({
        accountId: ctx.input.accountId,
      });
      const client = new ProtonClient({
        region: ctx.input.region,
        customUserAgent: 'aws-proton-plugin-for-backstage',
        credentialDefaultProvider: () => creds.sdkCredentialProvider,
      });

      const resp = await client.send(
        new CreateServiceCommand({
          name: ctx.input.serviceName,
          templateName: ctx.input.templateName,
          templateMajorVersion: ctx.input.templateMajorVersion,
          repositoryId:
            ctx.input.repository !== undefined
              ? `${ctx.input.repository.owner}/${ctx.input.repository.repo}`
              : undefined,
          repositoryConnectionArn: ctx.input.repositoryConnectionArn,
          branchName: ctx.input.branchName,
          spec: spec.toString(),
        }),
      );

      if (resp.service !== undefined) {
        ctx.logger.info(`Successfully created service ${resp.service.arn}`);
        ctx.output('arn', `${resp.service.arn}`);
      }
    },
  });
}
