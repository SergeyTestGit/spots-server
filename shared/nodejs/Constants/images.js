const imageTypes = {
  categoryIcon: "categoryIcon",
  serviceIcons: "serviceIcons",
  jobPics: "jobPics"
};

const bucketFolderNames = {
  [imageTypes.serviceIcon]: "category-icons",
  [imageTypes.subserviceIcon]: "service-icons",
  [imageTypes.jobPics]: "job-pics"
};

module.exports.bucketFolderNames = bucketFolderNames;
module.exports.imageTypes = imageTypes;
