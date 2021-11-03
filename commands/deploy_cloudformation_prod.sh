aws cloudformation deploy \
  --profile prod \
  --s3-bucket dev-profile-photos-408275994567-us-east-2 \
  --template-file generated/template-prod-generated.yaml \
  --stack-name spotjobs-API-Stack \
  --capabilities CAPABILITY_IAM
