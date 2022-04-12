# Usage

This documentation covers how to use the AWS Proton plugins for Backstage.  Follow the [installation documentation](install.md) to install the plugins into your Backstage application.

## Catalog Entity Annotation

Annotate a component with key `aws.com/proton-service` and a Proton service ARN as the value. Components with this annotation will have a Proton service overview card in their Overview tab.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: [...]
  annotations:
    [...]
    aws.com/proton-service: arn:aws:proton:us-west-2:1234567890:service/my-proton-service
spec:
  [...]
```

## AWS Proton Create Service Software Templates Scaffolder Action

The `aws:create-proton-service` scaffolder action allows Backstage templates to create a AWS Proton service for new components.

The action makes the following assumptions:
- AWS Proton service templates are maintained separately
- AWS Proton environments have already been created
- Appropriate AWS Proton repository connections have been configured

To use the custom action in a template, you can add a step similar to the following:

```yaml
spec:
  [...]
  steps:
    [...]
    - id: proton
      name: Create Proton Service
      action: aws:create-proton-service
      input:
        serviceName: ${{ parameters.component_id }}
        templateName: my-proton-template
        templateMajorVersion: '1'
        repository: ${{ parameters.repoUrl | parseRepoUrl }}
        branchName: main
        repositoryConnectionArn: 'arn:aws:codestar-connections:us-west-2:1234567890:connection/4dde5c82-51d6-4ea9-918e-03aed6971ff3'
        serviceSpecPath: service_spec.yml
```
