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
import {
  Typography,
  Box,
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent,
  makeStyles,
  LinearProgress,
} from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { MissingAnnotationEmptyState, IconLinkVerticalProps, HeaderIconLinkRow } from '@backstage/core-components';
import ErrorBoundary from '../ErrorBoundary';
import { useEntity } from "@backstage/plugin-catalog-react";
import ViewServiceIcon from '@material-ui/icons/Visibility';
import { AWS_PROTON_SERVICE_ANNOTATION } from '../../constants';
import { useProtonServiceArnFromEntity } from '../../hooks/useProtonServiceArnFromEntity';
import { useProtonService } from '../../hooks/useProtonService';
import { ProtonService } from '@internal/aws-proton-common';
import { isAWSProtonServiceAvailable } from '../../plugin';

const useStyles = makeStyles((theme) => ({
  links: {
    margin: theme.spacing(2, 0),
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    gridGap: theme.spacing(3),
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  value: {
    fontWeight: 'bold',
    overflow: 'hidden',
    lineHeight: '24px',
    wordBreak: 'break-word',
  },
  description: {
    wordBreak: 'break-word',
  },
}));

const AboutField = ({
  label,
  value,
  gridSizes,
  children,
}: {
  label: string;
  value?: string | JSX.Element;
  gridSizes?: Record<string, number>;
  children?: React.ReactNode;
}) => {
  const classes = useStyles();

  // Content is either children or a string prop `value`
  const content = React.Children.count(children) ? (
    children
  ) : (
    <Typography variant="body2" className={classes.value}>
      {value || `unknown`}
    </Typography>
  );
  return (
    <Grid item {...gridSizes}>
      <Typography variant="subtitle2" className={classes.label}>
        {label}
      </Typography>
      {content}
    </Grid>
  );
};

const State = ({ value }: { value: string }) => {
  var color = 'gray';
  var displayText = 'Unknown';

  switch(value) {
    case 'CREATE_IN_PROGRESS':
      displayText = 'Creating'
      color = 'orange'
      break;
    case 'CREATE_FAILED_CLEANUP_IN_PROGRESS':
    case 'CREATE_FAILED_CLEANUP_COMPLETE':
    case 'CREATE_FAILED_CLEANUP_FAILED':
    case 'CREATE_FAILED':
      displayText = 'Create failed'
      color = 'red'
      break;
    case 'DELETE_FAILED':
      displayText = 'Delete failed'
      color = 'red'
      break;
    case 'DELETE_IN_PROGRESS':
      displayText = 'Delete in progress'
      color = 'orange'
      break;
    case 'UPDATE_IN_PROGRESS':
      displayText = 'Update in progress'
      color = 'orange'
      break;
    case 'UPDATE_FAILED_CLEANUP_IN_PROGRESS':
    case 'UPDATE_FAILED_CLEANUP_COMPLETE':
    case 'UPDATE_FAILED_CLEANUP_FAILED':
    case 'UPDATE_FAILED':
      displayText = 'Update failed'
      color = 'red'
      break;
    case 'ACTIVE':
      displayText = 'Active'
      color = 'green'
      break;
    
    //| DELETE_FAILED UPDATE_COMPLETE_CLEANUP_FAILED
    default:
      color = 'green'
  }


  return (
    <Box display="flex" alignItems="center">
      <span
        style={{
          display: 'block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          marginRight: '5px',
        }}
      />
      {displayText}
    </Box>
  );
};
const OverviewComponent = ({ service }: { service: ProtonService }) => {
  const href = `https://${service.region}.console.aws.amazon.com/proton/home?region=${service.region}#/services/detail/${service.name}`;

  const links : IconLinkVerticalProps[] = []
  links.push({
    label: 'View Service',
    disabled: false,
    icon: <ViewServiceIcon />,
    href: href,
  });

  const classes = useStyles();
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">AWS Proton Service</Typography>}
        subheader={<HeaderIconLinkRow links={links} />}
      />
      <Divider />
      <CardContent>
        <Grid container>
          <AboutField label="Name" 
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography
              variant="body2"
              paragraph
              className={classes.description}
            >
              {service.name}
            </Typography>
          </AboutField>
          <AboutField label="Template" 
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography
              variant="body2"
              paragraph
              className={classes.description}
            >
              {service.templateName} v{service.templateMajorVersion}.{service.templateMinorVersion}
            </Typography>
          </AboutField>
          <AboutField
            label="Status" // Pending | Active | Inactive | Failed
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          >
            <State value={service.status} />
          </AboutField>
        </Grid>
      </CardContent>
    </Card>
  );
};

const AWSProtonServiceOverview = ({ entity }: { entity: Entity }) => {
  const { arn } = useProtonServiceArnFromEntity(entity);

  const [serviceData] = useProtonService({
    arn
  });
  if (serviceData.loading) {
    return (
      <Card>
        <CardHeader title={<Typography variant="h5">AWS Proton Service</Typography>} />
        <LinearProgress />
      </Card>
    );
  }
  return (
    <>{serviceData.service && <OverviewComponent service={serviceData.service} />}</>
  );
};

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

export const AWSProtonServiceOverviewWidget = (_props: Props) => {
  const { entity } = useEntity();
  return !isAWSProtonServiceAvailable(entity) ? (
    <MissingAnnotationEmptyState annotation={AWS_PROTON_SERVICE_ANNOTATION} />
  ) : (
    <ErrorBoundary>
      <AWSProtonServiceOverview entity={entity} />
    </ErrorBoundary>
  );
};