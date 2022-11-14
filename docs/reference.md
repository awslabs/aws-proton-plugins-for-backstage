# AWS Proton plugins for Backstage reference

This document covers the configuration options for the AWS Proton plugins for Backstage. To install the Proton plugins into your Backstage application, see the [AWS Proton plugins for Backstage installation guide](install.md). For a detailed walkthrough of using the Proton plugins in your Backstage app, see [Tutorial: using the AWS Proton plugins for Backstage](tutorial.md).

## Catalog entity annotation

Annotate a component with the key `aws.amazon.com/aws-proton-service` and an AWS Proton service ARN as the value. Components with this annotation have an **AWS Proton service** card in their **Overview** tab.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: [...]
  annotations:
    [...]
    aws.amazon.com/aws-proton-service: arn:aws:proton:us-east-1:111111111111:service/my-proton-service
spec:
  [...]
```

## Software Templates scaffolder action: create an AWS Proton service

The `aws:proton:create-service` scaffolder action allows Backstage Software Templates to create an AWS Proton service for new components.

This action assumes that the following AWS resources are already created in your AWS account, prior to creating a Backstage Software Template:

- [Proton service templates](https://docs.aws.amazon.com/proton/latest/adminguide/ag-templates.html)
- [Proton environments](https://docs.aws.amazon.com/proton/latest/adminguide/ag-environments.html)
- [CodeStar Connections connections](https://docs.aws.amazon.com/dtconsole/latest/userguide/welcome-connections.html)

To use this action in a Software Template, add a step similar to the following:

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
        repositoryConnectionArn: 'arn:aws:codestar-connections:us-east-1:111111111111:connection/4dde5c82-51d6-4ea9-918e-03aed6971ff3'
        serviceSpecPath: service_spec.yml
```

For full documentation of the `aws:proton:create-service` scaffolder action inputs and outputs, see the `https://<your backstage app>/create/actions` page in your Backstage app.
