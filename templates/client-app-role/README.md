Client app role 
aws --region us-east-1 cloudformation deploy \
    --stack-name SpotJobs-Client-Stack \
    --no-fail-on-empty-changeset \
    --template-file app-user-role.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
      ProjectPrefix="SpotJobs"
      RoleName="client-app-role"