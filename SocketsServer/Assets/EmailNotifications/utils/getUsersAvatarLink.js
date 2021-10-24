const ProfileImagesManager = require("../../../Managers/ProfileImagesManager");

const { DEFAULT_BUCKET_NAME } = require("../../../Constants/s3.constants");

module.exports = userProfile => {
  const { avatarURL, username } = userProfile;

  if (!avatarURL) {
    return `https://${DEFAULT_BUCKET_NAME}-097579889258-us-east-1.s3.amazonaws.com/email-icons/no_img.png`;
  }

  const usersAvatarSignedUrl = ProfileImagesManager.getSignedURLForProfileImage(
    "avatar",
    avatarURL,
    username
  );

  return usersAvatarSignedUrl;
};
