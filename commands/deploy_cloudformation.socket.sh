aws cloudformation deploy \
    --s3-bucket spotjobs-socket-package-test \
    --template-file generated/template-socket-generated.yaml \
    --stack-name spotjobs-socket-test \
    --capabilities CAPABILITY_IAM