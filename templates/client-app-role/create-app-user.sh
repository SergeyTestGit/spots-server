#!/bin/bash

PROJECT_PREFIX="spotjobs"
IMAGES_BUCKET_NAME="spotjob-images"
PROFILE_IMAGES_BUCKET_NAME="ec-spotjobs-profile-images-097579889258-us-east-2"
USERNAME_NAME="app-client-user"
KMS_KEY_ARN="arn:aws:kms:us-east-2:097579889258:key/959df08d-4287-436b-bc66-4628d9ea4534"
AWS_PROFILE="default"

while [ "$1" != "" ]; do
  case $1 in
  --user-name)
    shift
    USERNAME_NAME=$1
    ;;
  --profile-images-bucket)
    shift
    PROFILE_IMAGES_BUCKET_NAME=$1
    ;;
  --images-bucket)
    shift
    IMAGES_BUCKET_NAME=$1
    ;;
  --kms-key)
    shift
    KMS_KEY_ARN=$1
    ;;
  --aws-profile)
    shift
    AWS_PROFILE=$1
    ;;
  *)
    shift
    ;;
  esac

  shift
done

USER_NAME="${PROJECT_PREFIX}-${USERNAME_NAME}"

USER_DATA=$(aws iam create-user --profile $AWS_PROFILE --user-name $USER_NAME)

USER_POLICY="{
  \"Version\": \"2012-10-17\",
  \"Statement\": [
    {
      \"Action\": [
        \"s3:GetObject\",
        \"s3:PutObject\",
        \"s3:DeleteObject\"
      ],
      \"Resource\": \"arn:aws:s3:::${PROFILE_IMAGES_BUCKET_NAME}/*\",
      \"Effect\": \"Allow\"
    },
    {
      \"Action\": [
        \"s3:GetObject\",
        \"s3:PutObject\",
        \"s3:DeleteObject\"
      ],
      \"Resource\": \"arn:aws:s3:::${IMAGES_BUCKET_NAME}/*\",
      \"Effect\": \"Allow\"
    }
  ]
}"

KMS_KEY_POLICY="{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
        {
            \"Effect\": \"Allow\",
            \"Action\": [
                \"kms:GenerateDataKey\",
                \"kms:Decrypt\"
            ],
            \"Resource\": \"$KMS_KEY_ARN\"
        }
    ]
}"

USER_POLICY_DATA=$(aws iam create-policy --profile $AWS_PROFILE --policy-name ${PROJECT_PREFIX}-$USER_NAME-policy --policy-document "$USER_POLICY" --description "Spotjobs app client policy")
USER_POLICY_ARN=$(echo $USER_POLICY_DATA | python3 -c "import sys, json; print(json.load(sys.stdin)['Policy']['Arn'])")

KMS_POLICY_DATA=$(aws iam create-policy --profile $AWS_PROFILE --policy-name ${PROJECT_PREFIX}-kms-key-policy --policy-document "$KMS_KEY_POLICY" --description "Spotjobs kms key policy")
KMS_POLICY_ARN=$(echo $KMS_POLICY_DATA | python3 -c "import sys, json; print(json.load(sys.stdin)['Policy']['Arn'])")

$(aws iam attach-user-policy --profile $AWS_PROFILE --user-name $USER_NAME --policy-arn "$USER_POLICY_ARN")
$(aws iam attach-user-policy --profile $AWS_PROFILE --user-name $USER_NAME --policy-arn "$KMS_POLICY_ARN")
aws iam create-access-key --profile $AWS_PROFILE --user-name $USER_NAME
