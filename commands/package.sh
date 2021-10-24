aws cloudformation package \
    --s3-bucket spotjobs-server-package-test \
    --template-file template.yaml \
    --output-template-file generated/template-generated.yaml