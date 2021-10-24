aws cloudformation package \
    --s3-bucket spotjobs-socket-package-test \
    --template-file template-socket.yaml \
    --output-template-file generated/template-socket-generated.yaml