const { get } = require("lodash");

const { DEFAULT_BUCKET_NAME } = require("../../../Constants/s3.constants");

module.exports = jobData => {
  const { _id } = jobData;

  const imagesId = get(jobData, "pics[0]", null);

  if (!imagesId) {
    return `https://${DEFAULT_BUCKET_NAME}-097579889258-us-east-1.s3.amazonaws.com/email-icons/no_img.png`;
  }

  const jobsImageLink = `https://${DEFAULT_BUCKET_NAME}-097579889258-us-east-1.s3.amazonaws.com/job-pics/${_id}/${imagesId}`;

  return jobsImageLink;
};
