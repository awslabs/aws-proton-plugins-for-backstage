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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const config = new ConfigReader({});
    const router = await createRouter({
      logger: getVoidLogger(),
      config,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /service without arn', () => {
    it('returns error message', async () => {
      const response = await request(app).get('/service');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: 'No ARN provided' });
    });
  });

  describe('GET /serviceInstances without arn', () => {
    it('returns error message', async () => {
      const response = await request(app).get('/serviceInstances');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: 'No ARN provided' });
    });
  });
});
