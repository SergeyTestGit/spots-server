aws cloudformation deploy \
    --s3-bucket spotjobs-server-package-test \
    --template-file generated/template-generated.yaml \
    --stack-name spotjobs-server-test \
    --capabilities CAPABILITY_IAM