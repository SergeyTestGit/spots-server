const Yup = require("yup");
const _ = require("lodash");

const { ImagesManager } = require("./ImagesManager");

const { PROFILE_IMAGES_BUCKET_NAME } = require("../Constants/s3.constants");
const {
  profileImageTypes,
  profileBucketFolderNames
} = require("../Constants/profileImages.constants");

class ProfileImagesManager extends ImagesManager {
  /**
   * Put profile image to S3 bucket\
   * Returns S3 response
   *
   * @param {object} data image parametrs { image, imageType }
   * @param {object} paramsOverride override default put options
   */
  async putProfileImage(data, paramsOverride = {}) {
    const alowedImageTypes = Object.values(profileImageTypes);

    const validationSchema = Yup.object().shape({
      image: Yup.string()
        .required()
        .matches(/(data:image\/.*?;base64),/g),
      imageType: Yup.mixed().oneOf(alowedImageTypes)
    });

    await validationSchema.validate(data);

    const putParams = {
      bucket: PROFILE_IMAGES_BUCKET_NAME,
      folderName: profileBucketFolderNames[data.imageType]
    };

    const response = await this.putImage(
      data,
      _.assign(putParams, paramsOverride)
    );

    return response;
  }

  /**
   * Removes profile image from S3 \
   * Returns S3 response
   * @param {string} imageType Type of image to remove
   * @param {string} filename Filename of image to remove
   * @param {object} paramsOverride Override default delete options
   */
  async removeProfileImage(imageType, filename, paramsOverride) {
    const deleteParams = {
      bucket: PROFILE_IMAGES_BUCKET_NAME,
      folderName: profileBucketFolderNames[imageType]
    };

    const response = await this.removeImage(
      imageType,
      filename,
      _.assign(deleteParams, paramsOverride)
    );

    return response;
  }

  /**
   * Updates user profile images on S3\
   * Returns array of images filenames
   * @param {String} type Images type
   * @param {Array} images Array of images
   * @param {String} userId User's id
   */
  async updateProfileImages(type, images, userId) {
    const promises = images.map(image => {
      return new Promise((resolve, reject) => {
        if (_.isString(image)) {
          if (!!/(data:image\/.*?;base64),/g.exec(image)) {
            // new image
            this.putProfileImage(
              {
                imageType: type,
                image
              },
              { subfolder: userId }
            )
              .then(response => resolve(response.filename))
              .catch(err => reject(err));
          } else {
            // stale image
            resolve(image);
          }
        } else {
          if (image.status === "deleted") {
            // deleted image
            this.removeProfileImage(type, image._id, { subfolder: userId })
              .then(() => resolve(null))
              .catch(err => reject(err));
          }
        }
      });
    });

    const imagesResults = await Promise.all(promises);

    return imagesResults.filter(filename => filename !== null);
  }

  /**
   * Returns signed url to get image from S3
   *
   * @param {string} imageType Type of image
   * @param {string} filename Filename of image
   * @param {String} userId User's id
   */
  getSignedURLForProfileImage(imageType, filename, userId) {
    const getParams = {
      bucket: PROFILE_IMAGES_BUCKET_NAME,
      folderName: profileBucketFolderNames[imageType]
    };

    if (imageType !== profileImageTypes.avatar) {
      getParams.subfolder = userId;
    }

    return this.getSignedURLForImage(imageType, filename, getParams);
  }

  /**
   * Get profile image from S3 \
   * Returns S3 response
   * @param {string} imageType Type of image to remove
   * @param {string} filename Filename of image to remove
   * @param {object} paramsOverride Override default delete options
   */
  async getProfileImage(imageType, filename, paramsOverride) {
    const getParams = {
      bucket: PROFILE_IMAGES_BUCKET_NAME,
      folderName: profileBucketFolderNames[imageType]
    };

    const response = await this.getImage(
      imageType,
      filename,
      _.assign(getParams, paramsOverride)
    );

    return response;
  }
}

module.exports = new ProfileImagesManager();
module.exports.ProfileImagesManager = ProfileImagesManager;
