aws cloudformation package \
  --profile prod \
  --s3-bucket spotjobs-lambdas-097579889258-us-east-2 \
  --template-file template-prod.yaml \
  --output-template-file generated/template-prod-generated.yaml
