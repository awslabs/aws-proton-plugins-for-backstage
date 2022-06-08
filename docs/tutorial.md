# Tutorial: using the AWS Proton plugins for Backstage

This tutorial walks you through an example of using the AWS Proton plugins for Backstage.

<!-- toc -->
- [Tutorial: using the AWS Proton plugins for Backstage](#tutorial-using-the-aws-proton-plugins-for-backstage)
  - [Set up your Backstage app](#set-up-your-backstage-app)
  - [Fork this repository](#fork-this-repository)
  - [Create prerequisite AWS resources](#create-prerequisite-aws-resources)
  - [Customize the sample software template](#customize-the-sample-software-template)
  - [Register the software template in your Backstage app](#register-the-software-template-in-your-backstage-app)
  - [Create a new component using the software template](#create-a-new-component-using-the-software-template)
  - [Tear down AWS resources](#tear-down-aws-resources)
<!-- tocstop -->

## Set up your Backstage app

This tutorial assumes that you have a working Backstage application.  To use this tutorial with a local Backstage app, follow the main [Backstage instructions](https://backstage.io/docs/getting-started/create-an-app) to create and run a Backstage app locally.

This tutorial also assumes that your Backstage app is connected to GitHub.  Ensure that you have a GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for Backstage, and set a `GITHUB_TOKEN` environment variable with that token in the environment where your Backstage app is running.  The token needs the `repo` scope.  For more information on connecting your Backstage app to GitHub, see [GitHub Locations](https://backstage.io/docs/integrations/github/locations) in the Backstage documentation.

Follow the [AWS Proton plugins for Backstage installation guide](install.md) to install the Proton plugins into your Backstage application.

## Fork this repository

This repository contains a sample Backstage software template. You use it to configure your AWS account information and register the plugins into your Backstage app.  You can create a public fork of this repository. Alternatively, duplicate this repository into a private repository (preferred).  For more information, see [Duplicating a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository) in the GitHub documentation.

## Create prerequisite AWS resources

Create the following AWS resources in your AWS account for this tutorial:
* An AWS CodeStar Connections repository connection
* An AWS Proton environment template
* An AWS Proton service template
* An AWS Proton environment

To create these resources, follow the **AWS Proton setup** section of the **Getting Started** guide in the AWS Proton console:

https://us-east-1.console.aws.amazon.com/proton/home?region=us-east-1#/getting-started

Notes:
* For the environment template, pick the sample template bundle "Environment for deploying web services that run on Fargate".
* For the service template, pick the sample template bundle "A web service on Fargate".
* Ensure that both your environment and service templates have been "published" in Proton. See the "Publish v1.0" button on each template's page in the Proton console.

At the end of the Getting Started guide, you should have at least one of each of the resources listed above:

```
$ aws proton list-environment-templates
{
    "templates": [
        {
            "arn": "arn:aws:proton:us-east-1:111111111111:environment-template/backstage-proton-plugins-tutorial-env-template",
            "createdAt": "2022-04-21T11:29:01.800000-07:00",
            "description": "Environment template for the Proton Backstage plugins tutorial",
            "displayName": "Backstage tutorial template",
            "lastModifiedAt": "2022-04-21T11:29:01.800000-07:00",
            "name": "backstage-proton-plugins-tutorial-env-template",
            "recommendedVersion": "1.0"
        }
    ]
}

$ aws proton list-service-templates
{
    "templates": [
        {
            "arn": "arn:aws:proton:us-east-1:111111111111:service-template/backstage-proton-plugins-tutorial-svc-template",
            "createdAt": "2022-04-21T11:48:07.137000-07:00",
            "description": "Service template for the Proton Backstage plugins tutorial",
            "displayName": "Backstage tutorial template",
            "lastModifiedAt": "2022-04-21T11:48:07.137000-07:00",
            "name": "backstage-proton-plugins-tutorial-svc-template",
            "recommendedVersion": "1.0"
        }
    ]
}

$ aws proton list-environments
{
    "environments": [
        {
            "arn": "arn:aws:proton:us-east-1:111111111111:environment/backstage-proton-plugins-tutorial-env",
            "createdAt": "2022-04-21T11:53:07.528000-07:00",
            "deploymentStatus": "SUCCEEDED",
            "description": "Environment for the Proton Backstage plugins tutorial",
            "lastDeploymentAttemptedAt": "2022-04-21T11:53:07.528000-07:00",
            "lastDeploymentSucceededAt": "2022-04-21T11:53:07.528000-07:00",
            "name": "backstage-proton-plugins-tutorial-env",
            "protonServiceRoleArn": "arn:aws:iam::111111111111:role/ProtonServiceRole",
            "templateMajorVersion": "1",
            "templateMinorVersion": "0",
            "templateName": "backstage-proton-plugins-tutorial-env-template"
        }
    ]
}

$ aws codestar-connections list-connections
{
    "Connections": [
        {
            "ConnectionName": "my-github-account",
            "ConnectionArn": "arn:aws:codestar-connections:us-east-1:111111111111:connection/c176b204-5bb1-48f1-b977-5aff4fa2df9d",
            "ProviderType": "GitHub",
            "OwnerAccountId": "111111111111",
            "ConnectionStatus": "AVAILABLE"
        }
    ]
}
```

## Customize the sample software template

The sample software template needs to be updated with the AWS resources you created in your account in the previous step.  Clone your fork of this repository, and make the following changes to the file `docs/tutorial-assets/fargate-nginx-template/template.yaml`.

1. Find the `template` step.  Update the `aws_proton_dev_environment_name`, `aws_proton_prod_environment_name`, `aws_account_id`, and `aws_region` fields to match the resources in your AWS account.
2. Find the `create-proton-service` step.  Update the `region`, `templateName`, `templateMajorVersion`, and `repositoryConnectionArn` fields to match the resources in your AWS account.

Commit and push these changes to your fork of this repository.

## Register the software template in your Backstage app

Edit your Backstage app configuration file to register your customized software template in your Backstage app.  For example, the file may be named `app-config.yaml`.

In the `catalog` section of the config file, add the following location to the `locations` list (replacing `<your-github-name>` first):

```
    # AWS Proton Plugins for Backstage tutorial template
    - type: url
      target: https://github.com/<your-github-name>/aws-proton-plugins-for-backstage/blob/main/docs/tutorial-assets/fargate-nginx-template/template.yaml
      rules:
        - allow: [Template]
```

Save your config file changes, and restart your Backstage app.

## Create a new component using the software template

In your Backstage app, create a new component that uses your customized software template.  Go to `https://<your backstage app>/create`, and choose the "Nginx Fargate Web Service" template.  Fill in a component name like `my-tutorial-service`.

![Tutorial scaffolder page 1](images/tutorial-scaffolder-1.png "Tutorial scaffolder page 1")

In the next step, fill in a name like `my-backstage-tutorial-website` for the private repository that Backstage will create for this new component.

![Tutorial scaffolder page 2](images/tutorial-scaffolder-2.png "Tutorial scaffolder page 2")

When the software template runs, you should see that Backstage successfully fetches the template, publishes initial code to a new GitHub repository, creates the AWS Proton service, and registers the component in the Backstage software catalog.

![Tutorial scaffolder page 3](images/tutorial-scaffolder-3.png "Tutorial scaffolder page 3")

Go to the new component's page: `http://<your backstage app>/catalog/default/component/my-tutorial-service`.  You should see an AWS Proton Service card in the component's Overview tab.

![Component entity card](images/tutorial-service-entity-card.png "Component entity card")

If you later need to re-register this component in your Backstage app, add the following location to the `locations` list (replacing `<your-github-name>` first) in the `catalog` section of your Backstage app config file:

```
    - type: url
      target: https://github.com/<your-github-name>/my-backstage-tutorial-website/blob/main/catalog-info.yaml
      rules:
        - allow: [Component]
```

## Tear down AWS resources

There is no additional charge for AWS Proton, but you will be charged for the AWS resources created by deploying environments and services, such as Fargate tasks.  When you are finished with this tutorial, you may wish to delete your Proton environments and services.

```
$ aws proton delete-service --name my-tutorial-service

$ aws proton wait service-deleted --name my-tutorial-service

$ aws proton delete-environment --name backstage-proton-plugins-tutorial-env
```
