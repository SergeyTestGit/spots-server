aws cloudformation package \
  --profile prod \
  --s3-bucket dev-profile-photos-408275994567-us-east-2 \
  --template-file template-prod.yaml \
  --output-template-file generated/template-prod-generated.yaml
