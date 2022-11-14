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

import { useAsyncRetry } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { awsProtonApiRef } from '../api';
import { useCallback } from 'react';
import { ProtonServiceData } from '../types';

export function useProtonService({ arn }: { arn: string }) {
  const protonServiceApi = useApi(awsProtonApiRef);

  const getService = useCallback(
    async () => {
      const service = await protonServiceApi.getService({
        arn: arn,
      });

      const serviceInstances = await protonServiceApi.listServiceInstances({
        arn: arn,
      });

      return {
        service,
        serviceInstances,
      };
    },
    [arn], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const {
    loading,
    value: service,
    error,
    retry,
  } = useAsyncRetry<ProtonServiceData | null>(async () => {
    return await getService();
  }, []);

  return [
    {
      loading,
      service,
      error,
      retry,
    },
  ] as const;
}
