aws cloudformation deploy \
  --profile prod \
  --s3-bucket spots-jobs-dev-408275994567-us-east-2 \
  --template-file generated/template-prod-generated.yaml \
  --stack-name spots-jobs-prod \
  --capabilities CAPABILITY_IAM
