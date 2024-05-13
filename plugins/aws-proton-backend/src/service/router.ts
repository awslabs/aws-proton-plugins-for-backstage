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

import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { DefaultAwsCredentialsManager, AwsCredentialsManager } from '@backstage/integration-aws-node';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { AwsProtonApi } from '../api';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  awsCredentialsManager?: AwsCredentialsManager
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const awsCredentialsManager = options.awsCredentialsManager || DefaultAwsCredentialsManager.fromConfig(config);
  const awsProtonApi = new AwsProtonApi(logger, awsCredentialsManager);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.get('/service', async (req, res) => {
    const arn = req.query.arn?.toString();

    if (arn === undefined) {
      res.status(400).send({ error: 'No ARN provided' });
      return;
    }

    const service = await awsProtonApi.getProtonService(arn);
    res.status(200).json(service);
  });

  router.get('/serviceInstances', async (req, res) => {
    const arn = req.query.arn?.toString();

    if (arn === undefined) {
      res.status(400).send({ error: 'No ARN provided' });
      return;
    }

    const service = await awsProtonApi.listProtonServiceInstances(arn);
    res.status(200).json(service);
  });

  router.use(errorHandler());
  return router;
}
