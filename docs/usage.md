# Usage

This documentation covers how to use the AWS Proton plugins for Backstage.  Follow the [installation documentation](install.md) to install the Proton plugins into your Backstage application.  See the [tutorial](tutorial.md) for a detailed walkthrough of using the Proton plugins in your Backstage app.

## Catalog Entity Annotation

Annotate a component with key `aws.amazon.com/aws-proton-service` and a Proton service ARN as the value. Components with this annotation will have a Proton service overview card in their Overview tab.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: [...]
  annotations:
    [...]
    aws.amazon.com/aws-proton-service: arn:aws:proton:us-west-2:1234567890:service/my-proton-service
spec:
  [...]
```

## Software Templates Scaffolder Action: Create AWS Proton Service

The `aws:proton:create-service` scaffolder action allows Backstage software templates to create a AWS Proton service for new components.

This action assumes that the following AWS resources are already created in your AWS account, prior to creating a Backstage software template:
* [Proton service templates](https://docs.aws.amazon.com/proton/latest/adminguide/ag-templates.html)
* [Proton environments](https://docs.aws.amazon.com/proton/latest/adminguide/ag-environments.html)
* [CodeStar Connections connections](https://docs.aws.amazon.com/dtconsole/latest/userguide/welcome-connections.html)

To use this action in a software template, you can add a step similar to the following:

```yaml
spec:
  [...]
  steps:
    [...]
    - id: proton
      name: Create Proton Service
      action: aws:proton:create-service
      input:
        serviceName: ${{ parameters.component_id }}
        templateName: my-proton-template
        templateMajorVersion: '1'
        region: us-east-1
        repository: ${{ parameters.repoUrl | parseRepoUrl }}
        branchName: main
        repositoryConnectionArn: 'arn:aws:codestar-connections:us-west-2:1234567890:connection/4dde5c82-51d6-4ea9-918e-03aed6971ff3'
        serviceSpecPath: service_spec.yml
```

For full documentation of the `aws:proton:create-service` scaffolder action inputs and outputs, see the following page in your Backstage app: `https://<your backstage app>/create/actions`.