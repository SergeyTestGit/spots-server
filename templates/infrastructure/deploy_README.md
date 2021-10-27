# Automated deployment of SpotJobs project

## Prerequisites

You need to be installed:

- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.htm)

## Deployment

1. Make sure that files `templates/infrastructure/deploy.sh`, `templates/infrastructure/deploy_dynamodb_tables.sh`, `templates/client-app-role/create-app-user.sh` are executable.
  To make file executable:
   - For MacOS run command
     ```
       chmod 755 deploy.sh
     ```
   - For Linux run command
     ```
       chmod +x deploy.sh
     ```
2. Run deployment script with command
   ```
     ./deploy.sh
   ```

## Possible parameters

**Please Note**
Such parameters as userpool name or any of bucket names would be prefixed with the project prefix and post fixed with the account number and the region (eg. `spotjobs-test-bucket-123456789012-us-east-2`)

| Parameter Name                | Description                    | Default Value                        |
| ----------------------------- | ------------------------------ | ------------------------------------ |
| --region                      | AWS Region to deploy the App   | us-east-2                            |
| --aws-profile                 | AWS Profile to deploy the App  | default                              |
| --project-prefix              | Project Prefix                 | spotjobs                             |
| --userpool-name               | AWS Cognito Userpool name      | users                                |
| --secured-bucket-name         | Secured Images Bucket Name     | profile-images                       |
| --public-bucket-name          | Public Images Bucket Name      | images                               |
| --web-app-bucket-name         | Web App Bucket Name            | web-app                              |
| --socket-server-ami-id        | Socket Server AMI ID           | ami-0310f8bd3bcdef0d9                |
| --socket-server-instance-type | Socket Server Instance Type    | t2.micro                             |
| --lambdas-bucket-name         | API lambdas bucket name        | lambdas                              |
| --stage-name                  | API Gateway stage name         | prod                                 |
| --web-app-domain-name         | Web App Domain Name            | spots-jobs.s3-website.us-east-2.amazonaws.com                      |
| --web-app-domain-ssl-cert-id  | Web App Domain SSL ACM Cert ID | a8d345db-d93d-41cc-9a09-70424f667009 |
| --db-regions                  | Regions to deploy DB Tables    | `!Ref --region`                      |
|                               | (regions separated with space) |                                      |
| --h                           | Display Help                   |                                      |
