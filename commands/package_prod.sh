aws cloudformation package \
  --profile prod \
  --s3-bucket spots-jobs-dev-408275994567-us-east-2 \
  --template-file template-prod.yaml \
  --output-template-file generated/template-prod-generated.yaml
