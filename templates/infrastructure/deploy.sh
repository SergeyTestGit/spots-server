#!/bin/bash

BOLD_TEXT=$(tput bold)
NORMAL_TEXT=$(tput sgr0)

PROJECT_PREFIX="spotjobs"
REGION="us-east-1"
AWS_PROFILE="default"

USERPOOL_NAME="users"
SECURED_S3_BUCKET_NAME="profile-images"
PUBLIC_S3_BUCKET_NAME="images"
WEB_APP_BUCKET_NAME="web-app"

SOCKET_SERVER_AMI_ID="ami-0310f8bd3bcdef0d9"
SOCKET_SERVER_INSTANCE_TYPE="t2.micro"

LAMBDAS_BUCKET_NAME="lambdas"
STAGE='prod'

WEB_APP_DOMAIN_NAME="spotjobsapp.com"
WEB_APP_DOMAIN_SSL_CERITIFICATE_ID="a8d345db-d93d-41cc-9a09-70424f667009"

DB_REGIONS=($REGION)

display_help() {
  echo "Possible parameters:"
  echo "  ${BOLD_TEXT}--region                          ${NORMAL_TEXT}AWS Region to deploy the App|Default: ${REGION}"
  echo "  ${BOLD_TEXT}--aws-profile                     ${NORMAL_TEXT}AWS Profile to deploy the App|Default: ${AWS_PROFILE}"
  echo "  ${BOLD_TEXT}--project-prefix                  ${NORMAL_TEXT}Project Prefix|Default: ${PROJECT_PREFIX}"
  echo "  ${BOLD_TEXT}--userpool-name                   ${NORMAL_TEXT}AWS Cognito Userpool name|Default: ${USERPOOL_NAME}"
  echo "  ${BOLD_TEXT}--secured-bucket-name             ${NORMAL_TEXT}Secured Images Bucket Name|Default: ${SECURED_S3_BUCKET_NAME}"
  echo "  ${BOLD_TEXT}--public-bucket-name              ${NORMAL_TEXT}Public Images Bucket Name|Default: ${PUBLIC_S3_BUCKET_NAME}"
  echo "  ${BOLD_TEXT}--web-app-bucket-name             ${NORMAL_TEXT}Web App Bucket Name|Default: ${WEB_APP_BUCKET_NAME}"
  echo "  ${BOLD_TEXT}--socket-server-ami-id            ${NORMAL_TEXT}Socket Server AMI ID|Default: ${SOCKET_SERVER_AMI_ID}"
  echo "  ${BOLD_TEXT}--socket-server-instance-type     ${NORMAL_TEXT}Socket Server Instance Type|Default: ${SOCKET_SERVER_INSTANCE_TYPE}"
  echo "  ${BOLD_TEXT}--lambdas-bucket-name             ${NORMAL_TEXT}API lambdas bucket name|Default: ${LAMBDAS_BUCKET_NAME}"
  echo "  ${BOLD_TEXT}--stage-name                      ${NORMAL_TEXT}API stage name|Default: ${STAGE}"
  echo "  ${BOLD_TEXT}--web-app-domain-name             ${NORMAL_TEXT}Web App Domain Name|Default: ${WEB_APP_DOMAIN_NAME}"
  echo "  ${BOLD_TEXT}--web-app-domain-ssl-cert-id      ${NORMAL_TEXT}Web App Domain SSL ACM Cert ID|Default: ${WEB_APP_DOMAIN_SSL_CERITIFICATE_ID}"
  echo "  ${BOLD_TEXT}--db-regions                      ${NORMAL_TEXT}Regions to deploy DB Tables|Default: [`!Ref --region`]"
}

while [ "$1" != "" ]; do
  case $1 in
  --h)
    display_help
    exit 0
    ;;
  --stage-name)
    shift
    STAGE=$1
    shift
    ;;
  --project-prefix)
    shift
    PROJECT_PREFIX=$1
    shift
    ;;
  --region)
    shift
    REGION=$1
    DB_REGIONS=(REGION)
    shift
    ;;
  --aws-profile)
    shift
    AWS_PROFILE=$1
    shift
    ;;
  --userpool-name)
    shift
    USERPOOL_NAME=$1
    shift
    ;;
  --secured-bucket-name)
    shift
    SECURED_S3_BUCKET_NAME=$1
    shift
    ;;
  --public-bucket-name)
    shift
    PUBLIC_S3_BUCKET_NAME=$1
    shift
    ;;
  --web-app-bucket-name)
    shift
    WEB_APP_BUCKET_NAME=$1
    shift
    ;;
  --socket-server-ami-id)
    shift
    SOCKET_SERVER_AMI_ID=$1
    shift
    ;;
  --socket-server-instance-type)
    shift
    SOCKET_SERVER_INSTANCE_TYPE=$1
    shift
    ;;
  --web-app-domain-name)
    shift
    WEB_APP_DOMAIN_NAME=$1
    shift
    ;;
  --web-app-domain-ssl-cert-id)
    shift
    WEB_APP_DOMAIN_SSL_CERITIFICATE_ID=$1
    shift
    ;;
  --db-regions)
    shift
    index=0
    while [[ "$1" != --* && "$1" != "" ]]; do
      DB_REGIONS[$index]=$1
      ((index += 1))
      shift
    done
    ;;
  *)
    shift
    ;;
  esac

done

echo "${BOLD_TEXT}> Start automation deploy for the project ${PROJECT_PREFIX}"
echo "> Start time: $(date)${NORMAL_TEXT}"

echo "${BOLD_TEXT}> Trying to get account ID...${NORMAL_TEXT}"
ACCOUNT_INFO=$(aws --profile prod sts get-caller-identity)
ACCOUNT_ID=$(echo $ACCOUNT_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['Account'])")

echo "ACCOUNT_ID $ACCOUNT_ID"

echo "${BOLD_TEXT}> Trying to get KMS Key ID...${NORMAL_TEXT}"
EXPORTS=$(aws cloudformation list-exports)
KMS_KEY_EXPORT_NAME="${ACCOUNT_ID}-${REGION}-atomx-kms-key-arn"
KMS_KEY_ID=$(python3 -c "from getKMSKeyId import getKMSKeyId; getKMSKeyId(\"${KMS_KEY_EXPORT_NAME}\", \"\"\"${EXPORTS}\"\"\")")

echo "${BOLD_TEXT}> Deploying Cognito Userpool...${NORMAL_TEXT}"
# DEPLOY USERPOOL
aws cloudformation deploy \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --stack-name ${PROJECT_PREFIX}-Auth-Stack \
  --no-fail-on-empty-changeset \
  --template-file cognito-user-pool.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
  ProjectPrefix=${PROJECT_PREFIX} \
  UserPoolName=${USERPOOL_NAME} \
  AutoVerifiedAttributes=email

USERPOOL_ARN=$(aws cloudformation describe-stacks --profile $AWS_PROFILE --region ${REGION} --stack-name ${PROJECT_PREFIX}-Auth-Stack --query "Stacks[0].Outputs[?OutputKey=='UserPoolArn'].OutputValue" --output text)
USERPOOL_CLINET_ID=$(aws cloudformation describe-stacks --profile $AWS_PROFILE --region ${REGION} --stack-name ${PROJECT_PREFIX}-Auth-Stack --query "Stacks[0].Outputs[?OutputKey=='UserPoolClientId'].OutputValue" --output text)

echo "USERPOOL_ARN $USERPOOL_ARN"
echo "USERPOOL_CLINET_ID $USERPOOL_CLINET_ID"

echo "${BOLD_TEXT}> Deploying Lambdas S3 bucket...${NORMAL_TEXT}"

# DEPLOY LAMBDAS BUCKET
aws --region ${REGION} cloudformation deploy \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --stack-name ${PROJECT_PREFIX}-API-bucket-Stack \
  --no-fail-on-empty-changeset \
  --template-file s3-lambdas.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
  ProjectPrefix=${PROJECT_PREFIX} \
  BucketName=${LAMBDAS_BUCKET_NAME} \
  Versioning=Enabled \
  --tags \
  "Owner=Atomx LLC" \
  "Name=Spot jobs Infrastructure" \
  "Environment=Dev" \
  "BusinessService=Spot Jobs"

LAMBDAS_BUCKET_FULL_NAME=$(aws cloudformation describe-stacks --profile $AWS_PROFILE --region ${REGION} --stack-name ${PROJECT_PREFIX}-API-bucket-Stack --query "Stacks[0].Outputs[?OutputKey=='APIBucketName'].OutputValue" --output text)

echo "LAMBDAS_BUCKET_FULL_NAME $LAMBDAS_BUCKET_FULL_NAME"

echo "${BOLD_TEXT}> Deploying DynamoDB tables...${NORMAL_TEXT}"
# DEPLOY DYNAMODB TABLES
DB_REGIONS_STR=""

for region in ${DB_REGIONS[*]}; do
  DB_REGIONS_STR+=" ${region}"
done

./deploy_dynamodb_tables.sh --region $REGION --aws-profile $AWS_PROFILE --db-regions$DB_REGIONS_STR

echo "${BOLD_TEXT}> Writing Default Items to the DB...${NORMAL_TEXT}"
# UPLOAD DEFAULT ITEMS TO THE DB
aws --profile $AWS_PROFILE dynamodb batch-write-item --request-items file://dynamoDB-default-content/Common.json
aws --profile $AWS_PROFILE dynamodb batch-write-item --request-items file://dynamoDB-default-content/PtsPrice.json
aws --profile $AWS_PROFILE dynamodb batch-write-item --request-items file://dynamoDB-default-content/Service-part1.json
aws --profile $AWS_PROFILE dynamodb batch-write-item --request-items file://dynamoDB-default-content/Service-part2.json

echo "${BOLD_TEXT}> Deploying Secured S3 bucket...${NORMAL_TEXT}"
# DEPLOY SECURED BUCKET
aws cloudformation deploy \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --stack-name ${PROJECT_PREFIX}-secured-bucket-Stack \
  --no-fail-on-empty-changeset \
  --template-file s3-template.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
  ProjectPrefix=${PROJECT_PREFIX} \
  BucketName=${SECURED_S3_BUCKET_NAME} \
  Versioning=Suspended \
  --tags \
  "Owner=Atomx LLC" \
  "Name=Spot jobs Infrastructure" \
  "Environment=Dev" \
  "BusinessService=Spot Jobs"

SECURED_S3_BUCKET_URL=$(aws cloudformation describe-stacks --profile $AWS_PROFILE --region ${REGION} --stack-name ${PROJECT_PREFIX}-secured-bucket-Stack --query "Stacks[0].Outputs[?OutputKey=='SecuredBucketName'].OutputValue" --output text)

echo "SECURED_S3_BUCKET_URL $SECURED_S3_BUCKET_URL"

echo "${BOLD_TEXT}> Deploying Public S3 bucket...${NORMAL_TEXT}"

# DEPLOY PUBLIC BUCKET
aws cloudformation deploy \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --stack-name ${PROJECT_PREFIX}-public-bucket-Stack \
  --no-fail-on-empty-changeset \
  --template-file s3-public-bucket.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
  ProjectPrefix=${PROJECT_PREFIX} \
  BucketName=${PUBLIC_S3_BUCKET_NAME} \
  Versioning=Suspended \
  --tags \
  "Owner=Atomx LLC" \
  "Name=Spot jobs Infrastructure" \
  "Environment=Dev" \
  "BusinessService=Spot Jobs"

PUBLIC_S3_BUCKET_URL=$(aws cloudformation describe-stacks --profile $AWS_PROFILE --region ${REGION} --stack-name ${PROJECT_PREFIX}-public-bucket-Stack --query "Stacks[0].Outputs[?OutputKey=='PublicBucketName'].OutputValue" --output text)

echo "PUBLIC_S3_BUCKET_URL $PUBLIC_S3_BUCKET_URL"

echo "${BOLD_TEXT}> Deploying Web App S3 bucket...${NORMAL_TEXT}"
# DEPLOY WEB APP BUCKET
aws cloudformation deploy \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --stack-name ${PROJECT_PREFIX}-WEB-APP-Stack \
  --no-fail-on-empty-changeset \
  --template-file s3-web-app-template.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
  ProjectPrefix=${PROJECT_PREFIX} \
  BucketName=${WEB_APP_BUCKET_NAME} \
  Versioning=Suspended \
  --tags \
  "Owner=Atomx LLC" \
  "Name=Spot jobs Infrastructure" \
  "Environment=Dev" \
  "BusinessService=Spot Jobs"

WEB_APP_BUCKET_URL=$(aws cloudformation describe-stacks --profile $AWS_PROFILE --region ${REGION} --stack-name ${PROJECT_PREFIX}-WEB-APP-Stack --query "Stacks[0].Outputs[?OutputKey=='WebAppBucketName'].OutputValue" --output text)

echo "WEB_APP_BUCKET_URL $WEB_APP_BUCKET_URL"

echo "${BOLD_TEXT}> Uploading icons...${NORMAL_TEXT}"

# DEPLOY SERVICE ICONS
aws s3 sync public-s3-bucket-default-content/ s3://${PUBLIC_S3_BUCKET_URL} --profile $AWS_PROFILE

echo "${BOLD_TEXT}> Creating EC2 key...${NORMAL_TEXT}"
# CREATE EC2 KEY
SERVER_KEY_RESPONSE=$(aws ec2 --profile $AWS_PROFILE create-key-pair --key-name "${PROJECT_PREFIX}-socket-server-key")
SERVER_KEY=$(echo $SERVER_KEY_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['KeyMaterial'])")

# WRITE EC2 KEY TO THE FILE
echo "$SERVER_KEY" >${PROJECT_PREFIX}-socket-server-key.pem

echo "${BOLD_TEXT}> Creating EC2 Security Group...${NORMAL_TEXT}"
# CREATE SECURITY GROUP
SOCKET_SERVER_SECURITY_GROUP_NAME="${PROJECT_PREFIX}-socket-server-security-group"

SECURITY_GROUP_INFO=$(aws ec2 create-security-group \
  --profile $AWS_PROFILE \
  --group-name $SOCKET_SERVER_SECURITY_GROUP_NAME \
  --description "${PROJECT_PREFIX} security group")

SECRITY_GROUP_ID=$(echo $SECURITY_GROUP_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['GroupId'])")

echo "${BOLD_TEXT}> Add inbound rules to the EC2 Security Group...${NORMAL_TEXT}"
# SETUP SECURITY GROUP INBOUND RULES
aws ec2 authorize-security-group-ingress \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --group-name $SOCKET_SERVER_SECURITY_GROUP_NAME \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --group-name $SOCKET_SERVER_SECURITY_GROUP_NAME \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --group-name $SOCKET_SERVER_SECURITY_GROUP_NAME \
  --protocol tcp \
  --port 3192 \
  --cidr 0.0.0.0/0

echo "${BOLD_TEXT}> Deploying EC2 instance...${NORMAL_TEXT}"
# DEPLOY EC2 INSTANCE
SOCKET_SERVER_INSTANCE_INFO=$(aws ec2 run-instances \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --image-id ${SOCKET_SERVER_AMI_ID} \
  --count 1 \
  --instance-type ${SOCKET_SERVER_INSTANCE_TYPE} \
  --key-name ${PROJECT_PREFIX}-socket-server-key \
  --security-group-ids $SECRITY_GROUP_ID \
  --placement AvailabilityZone=${REGION}a)

SOCKET_SERVER_INSTANCE_ID=$(echo $SOCKET_SERVER_INSTANCE_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['Instances'][0]['InstanceId'])")
echo "SOCKET_SERVER_INSTANCE_ID ${SOCKET_SERVER_INSTANCE_ID}"

aws --profile $AWS_PROFILE ec2 wait instance-running --instance-ids $SOCKET_SERVER_INSTANCE_ID

SOCKET_SERVER_DESCRIPTION=$(aws --profile $AWS_PROFILE ec2 describe-instances --instance-ids $SOCKET_SERVER_INSTANCE_ID)

SOCKET_SERVER_INSTANCE_IP=$(echo $SOCKET_SERVER_DESCRIPTION | python3 -c "import sys, json; print(json.load(sys.stdin)['Reservations'][0]['Instances'][0]['NetworkInterfaces'][0]['Association']['PublicDnsName'])")

SOCKET_SERVER_URL=http://${SOCKET_SERVER_INSTANCE_IP}

echo "SOCKET_SERVER_INSTANCE_IP $SOCKET_SERVER_INSTANCE_IP"

echo "${BOLD_TEXT}> Deploying autoscaling group...${NORMAL_TEXT}"
# DEPLOY AUTOSCALING GROUPE
AUTOSCALING_GROUP_NAME=${PROJECT_PREFIX}-socket-server-autoscaling-group
aws autoscaling create-auto-scaling-group \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --auto-scaling-group-name $AUTOSCALING_GROUP_NAME \
  --min-size 1 \
  --max-size 3 \
  --instance-id $SOCKET_SERVER_INSTANCE_ID \
  --vpc-zone-identifier subnet-b10af2fc,subnet-4f9bae13 \
  --availability-zones ${REGION}a ${REGION}b

aws autoscaling attach-instances \
  --profile $AWS_PROFILE \
  --instance-ids $SOCKET_SERVER_INSTANCE_ID \
  --auto-scaling-group-name $AUTOSCALING_GROUP_NAME

echo "${BOLD_TEXT}> Packaging API...${NORMAL_TEXT}"
# PACKAGE API

cd ../..

pwd

aws cloudformation package \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --s3-bucket ${LAMBDAS_BUCKET_FULL_NAME} \
  --template-file template-prod.yaml \
  --output-template-file generated/template-prod-generated.yaml

echo "${BOLD_TEXT}> Deploying API...${NORMAL_TEXT}"
# DEPLOY API
aws cloudformation deploy \
  --profile $AWS_PROFILE \
  --region ${REGION} \
  --s3-bucket ${LAMBDAS_BUCKET_FULL_NAME} \
  --template-file generated/template-prod-generated.yaml \
  --stack-name ${PROJECT_PREFIX}-API-Stack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
  ApiName=${PROJECT_PREFIX}-API \
  ProfileImagesBucketName=${SECURED_S3_BUCKET_URL} \
  ImagesBucketName=${PUBLIC_S3_BUCKET_URL} \
  UserPoolId=${USERPOOL_ARN} \
  ClientAppId=${USERPOOL_CLINET_ID} \
  SocketServerUrl=${SOCKET_SERVER_URL} \
  Stage=${STAGE}

cd templates/infrastructure/

API_DOMAIN=$(aws cloudformation describe-stacks --profile $AWS_PROFILE --region ${REGION} --stack-name ${PROJECT_PREFIX}-API-Stack --query "Stacks[0].Outputs[?OutputKey=='ProdDataDomain'].OutputValue" --output text)

echo "API_DOMAIN ${API_DOMAIN}"

echo "${BOLD_TEXT}> Deploying Client App User...${NORMAL_TEXT}"
# DEPLOY CLINET-APP USER
APP_USER_ROLE_INFO=$(
  ../client-app-role/create-app-user.sh \
    --aws-profile $AWS_PROFILE \
    --profile-images-bucket $SECURED_S3_BUCKET_URL \
    --images-bucket $PUBLIC_S3_BUCKET_URL
)

AWS_ACCESS_KEY_ID=$(echo $APP_USER_ROLE_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['AccessKey']['AccessKeyId'])")
AWS_SECRET_ACCESS_KEY=$(echo $APP_USER_ROLE_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['AccessKey']['SecretAccessKey'])")

ENV_FILE_NAME=".env"

echo "${BOLD_TEXT}> Cloning web app project...${NORMAL_TEXT}"
# CLONE WEB-APP
git clone https://github.com/atomxllc/spotJobs-web-app.git --recurse-submodules

cd spotJobs-web-app

echo "${BOLD_TEXT}> Installing web app project dependencies...${NORMAL_TEXT}"
# INSTALL MODULES
npm i

echo "${BOLD_TEXT}> Writing project environment variables file...${NORMAL_TEXT}"
# WRITE ENVIRONMENT VARIABLES
echo "NODE_PATH=src/" >$ENV_FILE_NAME
echo "REACT_APP_API_URL=https://spotjobsapp.com/api" >>$ENV_FILE_NAME
echo "REACT_APP_SECOND_API=$SOCKET_SERVER_URL" >>$ENV_FILE_NAME
echo "REACT_APP_CLIENT_URL=https://www.spotjobsapp.com" >>$ENV_FILE_NAME
echo "REACT_APP_APP_BUNDLE_ID=com.spotjobs.mobile" >>$ENV_FILE_NAME
echo "REACT_APP_LOGO_PATH=https://s3.amazonaws.com/${PUBLIC_S3_BUCKET_URL}/email-icons/FN+2+SPOTJOBS++copy+8.png" >>$ENV_FILE_NAME
echo "REACT_APP_SOCKET_API=$SOCKET_SERVER_URL" >>$ENV_FILE_NAME
echo "REACT_APP_BACKET=$PUBLIC_S3_BUCKET_URL" >>$ENV_FILE_NAME
echo "REACT_APP_DEFAULT_BUCKET_NAME=${PUBLIC_S3_BUCKET_URL}" >>$ENV_FILE_NAME
echo "REACT_APP_PROFILE_IMAGES_BUCKET_NAME=$SECURED_S3_BUCKET_URL" >>$ENV_FILE_NAME
echo "REACT_APP_PUT_PARAMS_KMS_KEY=$KMS_KEY_ID" >>$ENV_FILE_NAME
echo "REACT_APP_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" >>$ENV_FILE_NAME
echo "REACT_APP_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" >>$ENV_FILE_NAME

echo "${BOLD_TEXT}> Building the web app...${NORMAL_TEXT}"
# BUILD WEB-APP
npm run build

echo "${BOLD_TEXT}> Deploying the web app to the S3 bucket...${NORMAL_TEXT}"
# DEPLOY WEB APP
aws s3 sync build/ s3://${WEB_APP_BUCKET_URL} --profile $AWS_PROFILE

cd ..

rm -rf spotJobs-web-app

APP_CLOUDFRONT_DISTRIB_CONFIG="{
  \"CallerReference\": \"${PROJECT_PREFIX}-distrib\",
  \"Aliases\": {
    \"Quantity\": 2,
    \"Items\": [
      \"www.${WEB_APP_DOMAIN_NAME}\",
      \"${WEB_APP_DOMAIN_NAME}\"
    ]
  },
  \"Origins\": {
    \"Quantity\": 2,
    \"Items\": [
      {
        \"Id\": \"api-origin\",
        \"DomainName\": \"${API_DOMAIN}\",
        \"OriginPath\": \"/${STAGE}\",
        \"CustomOriginConfig\": {
          \"HTTPPort\": 80,
          \"HTTPSPort\": 443,
          \"OriginProtocolPolicy\": \"https-only\"
        }
      },
      {
        \"Id\": \"web-app-origin\",
        \"DomainName\": \"${WEB_APP_BUCKET_URL}.s3-website-${REGION}.amazonaws.com\",
        \"CustomOriginConfig\": {
          \"HTTPPort\": 80,
          \"HTTPSPort\": 443,
          \"OriginProtocolPolicy\": \"http-only\"
        }
      }
    ]
  },
  \"ViewerCertificate\": {
    \"SSLSupportMethod\": \"sni-only\",
    \"CloudFrontDefaultCertificate\": false,
    \"ACMCertificateArn\": \"arn:aws:acm:${REGION}:${ACCOUNT_ID}:certificate/${WEB_APP_DOMAIN_SSL_CERITIFICATE_ID}\",
    \"MinimumProtocolVersion\": \"TLSv1.1_2016\"
  },
  \"DefaultCacheBehavior\": {
    \"TargetOriginId\": \"web-app-origin\",
    \"ForwardedValues\": {
      \"QueryString\": true,
      \"Cookies\": {
        \"Forward\": \"none\"
      }
    },
    \"TrustedSigners\": {
      \"Enabled\": false,
      \"Quantity\": 0
    },
    \"ViewerProtocolPolicy\": \"redirect-to-https\",
    \"MinTTL\": 3600
  },
  \"CacheBehaviors\": {
    \"Quantity\": 1,
    \"Items\": [
      {
        \"PathPattern\": \"/api/*\",
        \"TargetOriginId\": \"api-origin\",
        \"ForwardedValues\": {
          \"QueryString\": true,
          \"Cookies\": {
            \"Forward\": \"none\"
          },
          \"Headers\": {
            \"Quantity\": 3,
            \"Items\": [
              \"Cache-Control\",
              \"Authorization\",
              \"Date\"
            ]
          }
        },
        \"TrustedSigners\": {
          \"Enabled\": false,
          \"Quantity\": 0
        },
        \"ViewerProtocolPolicy\": \"redirect-to-https\",
        \"MinTTL\": 0,
        \"MaxTTL\": 0,
        \"DefaultTTL\": 0,
        \"AllowedMethods\": {
          \"Quantity\": 7,
          \"Items\": [
            \"GET\",
            \"HEAD\",
            \"POST\",
            \"PUT\",
            \"PATCH\",
            \"OPTIONS\",
            \"DELETE\"
          ],
          \"CachedMethods\": {
            \"Quantity\": 3,
            \"Items\": [
              \"HEAD\",
              \"GET\",
              \"OPTIONS\"
            ]
          }
        }
      }
    ]
  },
  \"Comment\": \"\",
  \"Logging\": {
    \"Enabled\": false,
    \"IncludeCookies\": true,
    \"Bucket\": \"\",
    \"Prefix\": \"\"
  },
  \"Enabled\": true
}"

echo "${BOLD_TEXT}> Deploying web app CloudFront...${NORMAL_TEXT}"
aws --profile $AWS_PROFILE cloudfront create-distribution \
  --distribution-config "${APP_CLOUDFRONT_DISTRIB_CONFIG}"

echo "${BOLD_TEXT}> Deploying DynamoBD backup rule...${NORMAL_TEXT}"
aws --profile $AWS_PROFILE cloudformation package \
  --s3-bucket ${LAMBDAS_BUCKET_FULL_NAME} \
  --template-file scheduleDynamoDBBackup.yaml \
  --output-template-file ../../generated/scheduleDynamoDBBackup-generated.yaml

aws --profile $AWS_PROFILE cloudformation deploy \
  --template-file ../../generated/scheduleDynamoDBBackup-generated.yaml \
  --s3-bucket ${LAMBDAS_BUCKET_FULL_NAME} \
  --no-fail-on-empty-changeset \
  --stack-name ${PROJECT_PREFIX}-data-backup \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
  ProjectPrefix=${PROJECT_PREFIX}

echo "Deployment is finished."
echo "${BOLD_TEXT}"
echo "***************************"
echo "******** CAUTION **********"
echo "** MANUAL STEPS REQUIRED **"
echo "***************************"
echo "${NORMAL_TEXT}"
echo "Don't forget to change the social media redirect url:"
echo "- Google: https://spotjobsapp.com/${STAGE}/auth/oauth/google/callback"
echo "- Facebook: https://spotjobsapp.com/${STAGE}/auth/oauth/facebook/callback"
echo "- Linkedin: https://spotjobsapp.com/${STAGE}/auth/oauth/linkedin/callback"
