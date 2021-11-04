aws cloudformation deploy \
    --s3-bucket spotjobs-server-package-test \
    --template-file generated/template-generated.yaml \
    --stack-name spots-jobs-prod2-test \
    --capabilities CAPABILITY_IAM