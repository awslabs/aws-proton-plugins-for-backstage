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
   Grid,
   Card,
   CardHeader,
   Divider,
   CardContent,
   makeStyles,
   LinearProgress,
 } from '@material-ui/core';
 import { Entity } from '@backstage/catalog-model';
 import moment from 'moment';
 import { MissingAnnotationEmptyState, IconLinkVerticalProps, HeaderIconLinkRow, TableColumn, Table, InfoCard, ResponseErrorPanel, StatusOK, StatusError, StatusWarning, StatusAborted, StatusRunning, StatusPending } from '@backstage/core-components';
 import { useEntity } from "@backstage/plugin-catalog-react";
 import ViewServiceIcon from '@material-ui/icons/Visibility';
 import { AWS_PROTON_SERVICE_ANNOTATION } from '../../constants';
 import { useProtonServiceArnFromEntity } from '../../hooks/useProtonServiceArnFromEntity';
 import { useProtonService } from '../../hooks/useProtonService';
 import { isAWSProtonServiceAvailable } from '../../plugin';
 import { ProtonServiceData } from '../../types';
 import { DeploymentStatus, ServiceInstanceSummary, ServiceStatus } from '@aws-sdk/client-proton';
 
 const deploymentStatusComponent = (state: string | undefined) => {
   switch (state) {
     case DeploymentStatus.SUCCEEDED:
       return (
         <span>
           <StatusOK /> Succeeded
         </span>
       );
     case DeploymentStatus.IN_PROGRESS:
       return (
         <span>
           <StatusRunning /> In progress
         </span>
       );
     case DeploymentStatus.FAILED:
       return (
         <span>
           <StatusError /> Failed
         </span>
       );
     default:
       return (
         <span>
           <StatusAborted /> Unknown
         </span>
       );
   }
 };
 
 export const ServiceInstanceTable = ({ serviceData }: { serviceData: ProtonServiceData }) => {
   const columns: TableColumn[] = [
     {
       title: 'Instance Name',
       field: 'name',
     },
     {
       title: 'Environment',
       field: 'environmentName',
     },
     {
       title: 'Template Version',
       field: 'templateName',
       render: (row: Partial<ServiceInstanceSummary>) => {
         if(row.templateMajorVersion === undefined) {
           return '-'
         }
         return `v${row.templateMajorVersion}.${row.templateMinorVersion}`
        },
     },
     {
       title: 'Deployment Status',
       field: 'deploymentStatus',
       render: (row: Partial<ServiceInstanceSummary>) => deploymentStatusComponent(row.deploymentStatus)
     },
   ];
 
   return (
     <div>
       <Table
         options={{ paging: false, search: false, toolbar: false, padding: 'dense' }}
         data={serviceData.serviceInstances}
         columns={columns}
       />
     </div>
   );
 };
 
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
 
 const serviceStatusComponent = (state: string | undefined) => {
   switch (state) {
     case ServiceStatus.CREATE_IN_PROGRESS:
       return (
         <span>
           <StatusRunning /> Create in progress
         </span>
       );
     case ServiceStatus.CREATE_FAILED_CLEANUP_IN_PROGRESS:
       return (
         <span>
           <StatusPending /> Create failed (Cleanup in progress)
         </span>
       );
     case ServiceStatus.CREATE_FAILED_CLEANUP_COMPLETE:
     case ServiceStatus.CREATE_FAILED_CLEANUP_FAILED:
     case ServiceStatus.CREATE_FAILED:
       return (
         <span>
           <StatusError /> Create failed
         </span>
       );
     case ServiceStatus.DELETE_FAILED:
       return (
         <span>
           <StatusError /> Delete failed
         </span>
       );
     case ServiceStatus.DELETE_IN_PROGRESS:
       return (
         <span>
           <StatusRunning /> Delete in progress
         </span>
       );
     case ServiceStatus.UPDATE_IN_PROGRESS:
       return (
         <span>
           <StatusRunning /> Update in progress
         </span>
       );
     case ServiceStatus.UPDATE_FAILED_CLEANUP_IN_PROGRESS:
       return (
         <span>
           <StatusPending /> Update failed (Cleanup in progress)
         </span>
       );
     case ServiceStatus.UPDATE_FAILED_CLEANUP_COMPLETE:
     case ServiceStatus.UPDATE_FAILED_CLEANUP_FAILED:
     case ServiceStatus.UPDATE_FAILED:
       return (
         <span>
           <StatusError /> Update failed
         </span>
       );
     case ServiceStatus.ACTIVE:
       return (
         <span>
           <StatusOK /> Active
         </span>
       );
     default:
       return (
         <span>
           <StatusWarning /> Unknown
         </span>
       );
   }
 };
 
 const OverviewComponent = ({ serviceData }: { serviceData: ProtonServiceData }) => {
   const href = `#`;
 
   const service = serviceData.service;
 
   const links : IconLinkVerticalProps[] = [{
     label: 'View Service',
     disabled: false,
     icon: <ViewServiceIcon />,
     href: href,
   }]
 
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
               {service.templateName}
             </Typography>
           </AboutField>
           <AboutField
             label="Status"
             gridSizes={{ xs: 12, sm: 6, lg: 4 }}
           >
             {serviceStatusComponent(service.status)}
           </AboutField>
         {service.pipeline && 
         <React.Fragment>
           <AboutField label="Pipeline Template Version" 
           gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
             <>{service.pipeline?.templateMajorVersion && <Typography
               variant="body2"
               paragraph
               className={classes.description}
             >
               v{service.pipeline?.templateMajorVersion}.{service.pipeline?.templateMinorVersion}
             </Typography>}</>
           </AboutField>
           <AboutField label="Pipeline Status" 
             gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
             <Typography
               variant="body2"
               paragraph
               className={classes.description}
             >
               {deploymentStatusComponent(service.pipeline?.deploymentStatus)}
             </Typography>
           </AboutField>
           <AboutField label="Last Deployment" 
             gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
             <Typography
               variant="body2"
               paragraph
               className={classes.description}
             >
               {moment(service.pipeline?.lastDeploymentAttemptedAt).fromNow()}
             </Typography>
           </AboutField>
         </React.Fragment>
         }
         </Grid>
       </CardContent>
       <ServiceInstanceTable serviceData={serviceData}/>
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
       <InfoCard title="AWS Proton Service">
         <LinearProgress />
       </InfoCard>
     );
   }
   if (serviceData.error) {
     return (
       <InfoCard title="AWS Proton Service">
          <ResponseErrorPanel error={serviceData.error} />
       </InfoCard>
     );
   }
   return (
     <>{serviceData.service && <OverviewComponent serviceData={serviceData.service} />}</>
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
     <AWSProtonServiceOverview entity={entity} />
   );
 };