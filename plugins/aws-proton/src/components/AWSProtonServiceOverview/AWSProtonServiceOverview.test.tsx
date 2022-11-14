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

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { awsProtonApiRef } from '../../api';
import {
  mockEntity,
  MockGetServiceAPIError,
  MockProtonService,
  MockProtonServiceNoPipeline,
} from '../../mocks';
import { EntityAWSProtonServiceOverviewCard } from '../../plugin';

describe('AWSProtonServiceOverview', () => {
  it('should render service', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={[[awsProtonApiRef, new MockProtonService()]]}>
          <EntityProvider entity={mockEntity}>
            <EntityAWSProtonServiceOverviewCard />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );

    await waitFor(() => rendered.getByText('AWS Proton Service'), {
      timeout: 3000,
    });

    expect(await rendered.findByText('mock-service')).toBeInTheDocument();
    expect(await rendered.findByText('mock-instance1')).toBeInTheDocument();
  });

  it('should report error', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider
          apis={[[awsProtonApiRef, new MockGetServiceAPIError()]]}
        >
          <EntityProvider entity={mockEntity}>
            <EntityAWSProtonServiceOverviewCard />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );

    await waitFor(() => rendered.getByText('AWS Proton Service'), {
      timeout: 3000,
    });

    expect(
      await rendered.findByText(
        'Error: Could not find arn:aws:proton:us-west-2:1234567890:service/mock-service!',
      ),
    ).toBeInTheDocument();
  });

  it('should render service without pipeline', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider
          apis={[[awsProtonApiRef, new MockProtonServiceNoPipeline()]]}
        >
          <EntityProvider entity={mockEntity}>
            <EntityAWSProtonServiceOverviewCard />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );

    await waitFor(() => rendered.getByText('AWS Proton Service'), {
      timeout: 3000,
    });

    expect(await rendered.queryByText('Pipeline Template Version')).toBeNull();
  });
});
