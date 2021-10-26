Service Catalog that creates an s3 bucket
To run this template:


aws --region <us-east-2/us-west-2> cloudformation deploy \
    --stack-name SpotJobs-Infrastructure-Stack \
    --no-fail-on-empty-changeset \
    --template-file s3-devops-bucket-and-cmk.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
      ProjectPrefix=<Project prefix eg. opsste|ec|crew> \
      BucketName=<The name of the bucket, please note: the bucket name that will be created will be prefixed with the projectPrefix and post fixed with the accountNumber and the region eg ec-test-bucket-123456789012-us-west-2   > \
      Versioning=<Enabled|Suspended> 
      ObjectExpirationInDays=<how long (in days) before the aws expires and removes the objects> \
      TransitionDaysForIA=<how long (in days) since object creation should aws move your object to IA (infrequently accessed) storage its cheaper> \
      TransitionDaysForGlacier=<how long (in days) since object creation should aws move your object to IA (Glacier) storage its far cheaper> \
    --tags \
      "Owner=Atomx LLC" \
      "Name=Spot jobs Infrastructure" \
      "Environment=Dev" \
      "BusinessService=Spot Jobs"


## there is a bug in the bboto3 that causes it not to support the --no-fail-on-empty-changeset  , if this happens to you please remove that flag
aws --region us-east-2 cloudformation deploy \
    --stack-name SpotJobs-Infrastructure-Kms-Key-Stack \
    --no-fail-on-empty-changeset \
    --template-file kms_key.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --tags \
      "Owner=Atomx LLC" \
      "Name=Spot jobs Infrastructure" \
      "Environment=Dev" \
      "BusinessService=Spot Jobs"
      
      
aws --region <us-east-2/us-west-2> cloudformation deploy \
    --stack-name SpotJobs-Infrastructure-Stack \
    --no-fail-on-empty-changeset \
    --template-file s3-template.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
      ProjectPrefix=<Project prefix eg. dev/prod> \
      BucketName=<The name of the bucket, please note: the bucket name that will be created will be prefixed with the projectPrefix and post fixed with the accountNumber and the region eg ec-test-bucket-123456789012-us-west-2   > \
      Versioning=<Enabled|Suspended> 
      ObjectExpirationInDays=<how long (in days) before the aws expires and removes the objects> \
      TransitionDaysForIA=<how long (in days) since object creation should aws move your object to IA (infrequently accessed) storage its cheaper> \
      TransitionDaysForGlacier=<how long (in days) since object creation should aws move your object to IA (Glacier) storage its far cheaper> \
    --tags \
      "Owner=Atomx LLC" \
      "Name=Spot jobs Infrastructure" \
      "Environment=Dev" \
      "BusinessService=Spot Jobs"      

Service Catalog that creates a Cognito User Pool
To run this template:
aws --region <us-east-2/us-west-2> cloudformation deploy \
    --stack-name SpotJobs-Infrastructure-Stack \
    --no-fail-on-empty-changeset \
    --template-file cognito-user-pool.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
      ProjectPrefix=<Project prefix eg. opsste|ec|crew> \
      UserPoolName=<The name of the User Pool, please note: the name that will be created will be prefixed with the           projectPrefix and post fixed with the accountNumber and the region eg ec-test-bucket-123456789012-us-west-2   > \
      AutoVerifiedAttributes=The attributes to be auto-verified ("email" / "phone_number"); Default "phone_number,number"
      UnusedAccountValidityDays= The user account expiration limit, in days, after which the account is no longer usable.     Default 365

VPC template
aws --region us-east-2 cloudformation deploy \
    --stack-name SpotJobs-Infrastructure-Stack \
    --no-fail-on-empty-changeset \
    --template-file vpc.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
      ProjectPrefix="SpotJobs"

Client app role 
aws --region us-east-2 cloudformation deploy \
    --stack-name SpotJobs-Client-Stack \
    --no-fail-on-empty-changeset \
    --template-file app-user-role.yml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
      ProjectPrefix="SpotJobs"
      RoleName="client-app-role"