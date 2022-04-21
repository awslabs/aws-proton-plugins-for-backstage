# Tutorial

This tutorial walks through an example of how to use the AWS Proton plugins for Backstage.

<!-- toc -->
1. [Setup your Backstage app](#setup-your-backstage-app)
1. [Fork this repository](#fork-this-repository)
1. [Create the prerequisite AWS resources](#create-the-prerequisite-aws-resources)
1. [Customize the sample software template](#customize-the-sample-software-template)
1. [Register the software template in your Backstage app](#register-the-software-template-in-your-backstage-app)
1. [Create a new component using the software template](#create-a-new-component-using-the-software-template)
1. [Tear down AWS resources](#tear-down-aws-resources)
<!-- tocstop -->

## Setup your Backstage app

This tutorial assumes that you have a working Backstage application.  To follow this tutorial with a local Backstage app, follow the main [Backstage instructions](https://backstage.io/docs/getting-started/create-an-app) to create and run a Backstage app locally.

This tutorial also assumes that your Backstage app is connected to GitHub.  Ensure that you have a GitHub [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for Backstage, and set a `GITHUB_TOKEN` environment variable with that token in the environment where your Backstage app running.  The token needs the `repo` scope.  See the [Backstage documentation](https://backstage.io/docs/integrations/github/locations) for more information on connecting your Backstage app to GitHub.

Follow the [installation documentation](install.md) to install the Proton plugins into your Backstage application.

## Fork this repository

This repository contains a sample Backstage software template that you will need to customize with your AWS account information and register into your Backstage app.  You can either create a public fork of this repository, or duplicate this repository into a private repository (preferred).  Follow the [GitHub documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository) for duplicating this repository.

## Create the prerequisite AWS resources

The following AWS resources need to be created in your AWS account for this tutorial.
* A Proton environment template
* A Proton service template
* A Proton environment
* A CodeStar Connections repository connection

To create these resources, follow the "Proton setup" section of the Getting Started guide in the AWS Proton console:

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

In your Backstage app, create a new component that uses your customized software template: `https://<your backstage app>/create`.  Select the `Nginx Fargate Web Service` template

http://localhost:3000/create/

## Tear down AWS resources

There is no additional charge for AWS Proton, but you will be charged for the AWS resources like Fargate tasks created by deploying environments and services.  When you are finished with this tutorial, you may wish to delete your Proton environments and services.

```
$ aws proton delete-service --name my-tutorial-service

$ aws proton wait service-deleted --name my-tutorial-service

$ aws proton delete-environment --name backstage-proton-plugins-tutorial-env
```
