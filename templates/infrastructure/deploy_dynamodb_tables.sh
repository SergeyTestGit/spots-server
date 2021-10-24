#!/bin/bash

BOLD_TEXT=$(tput bold)
NORMAL_TEXT=$(tput sgr0)

REGION="us-east-1"
AWS_PROFILE="default"

DB_REGIONS=()

display_help() {
  echo "Possible parameters:"
  echo "  ${BOLD_TEXT}--region                          ${NORMAL_TEXT}AWS Region to deploy the App|Default: ${REGION}"
  echo "  ${BOLD_TEXT}--aws-profile                     ${NORMAL_TEXT}AWS Profile to deploy the App|Default: ${AWS_PROFILE}"
}

while [ "$1" != "" ]; do
  case $1 in
  --h)
    display_help
    exit 0
    ;;
  --region)
    shift
    REGION=$1
    shift
    ;;
  --aws-profile)
    shift
    AWS_PROFILE=$1
    shift
    ;;
  --db-regions)
    shift
    index=0
    while [[ "$1" != --* && "$1" != "" ]]; do
      echo $1 $index
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

for region in ${DB_REGIONS[*]}; do
  echo "region $region"

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name ApplyForJob \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name Chat \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name Common \
    --attribute-definitions \
    AttributeName=type,AttributeType=S \
    --key-schema \
    AttributeName=type,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name FavouriteJob \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name FavouriteSP \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name FavouriteSP \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name Job \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name JobArchive \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name JobIgnore \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name JobRequest \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name JobReview \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name Notification \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name PendingTransaction \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name PtsPrice \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name Service \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name SocketConnection \
    --attribute-definitions \
    AttributeName=connectionId,AttributeType=S \
    --key-schema \
    AttributeName=connectionId,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name Subscription \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name Transaction \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name User \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

  aws dynamodb create-table \
    --profile $AWS_PROFILE \
    --region $region \
    --table-name UserReport \
    --attribute-definitions \
    AttributeName=_id,AttributeType=S \
    --key-schema \
    AttributeName=_id,KeyType=HASH \
    --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES
done

REPLICATION_GROUP_VALUE=""

for region in ${DB_REGIONS[*]}; do
  REPLICATION_GROUP_VALUE+=" RegionName=${region}"
done

DEFAULT_REGION=${DB_REGIONS[0]}

echo "REPLICATION_GROUP_VALUE $REPLICATION_GROUP_VALUE"
echo "DEFAULT_REGION $DEFAULT_REGION"

aws dynamodb create-global-table \
  --global-table-name ApplyForJob \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name Chat \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name Common \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name FavouriteJob \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name FavouriteSP \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name Job \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name JobArchive \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name JobIgnore \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name JobRequest \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name JobReview \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name Notification \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name PendingTransaction \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name PtsPrice \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name Service \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name SocketConnection \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name Subscription \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name Transaction \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name User \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION

aws dynamodb create-global-table \
  --global-table-name UserReport \
  --replication-group$REPLICATION_GROUP_VALUE \
  --region $DEFAULT_REGION
