const profileImageTypes = {
  avatar: "avatar",
  picsOfWork: "picOfWork",
  certificates: "certificate",
  idPics: "idPic"
};

const profileBucketFolderNames = {
  [profileImageTypes.avatar]: "avatars",
  [profileImageTypes.picsOfWork]: "pics_of_work",
  [profileImageTypes.certificates]: "user_certificates",
  [profileImageTypes.idPics]: "user_id_pics"
};

module.exports.profileBucketFolderNames = profileBucketFolderNames;
module.exports.profileImageTypes = profileImageTypes;
