aws cloudformation deploy \
  --profile prod \
  --s3-bucket spotjobs-lambdas-097579889258-us-east-1 \
  --template-file generated/template-prod-generated.yaml \
  --stack-name spotjobs-API-Stack \
  --capabilities CAPABILITY_IAM
