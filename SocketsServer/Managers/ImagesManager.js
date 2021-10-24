const _ = require("lodash");
const uuid = require("uuid");

const S3 = require("../Libs/S3.lib");

const {
  DEFAULT_BUCKET_NAME,
  bucketFolderNames
} = require("../Constants/images.constants");

class ImagesManager {
  /**
   * Put image to S3 bucket\
   * Returns S3 response
   *
   * @param {object} data image parametrs { image, imageType }
   * @param {object} paramsOverride override default put options
   */
  async putImage(data, paramsOverride = {}) {
    const { image: b64Image, imageType } = data;

    const fileBody = b64Image.substr(b64Image.indexOf(";base64,") + 8);
    const decodedFile = Buffer.from(fileBody, "base64");
    const ext =
      paramsOverride.ext ||
      b64Image.substring("data:image/".length, b64Image.indexOf(";"));

    const imageName = paramsOverride.imageName || uuid.v4();
    const filename = `${imageName}.${ext}`;
    const folderName =
      paramsOverride.folderName || bucketFolderNames[imageType];
    const filePath =
      paramsOverride.filePath ||
      `${folderName}/${
        paramsOverride.subfolder ? paramsOverride.subfolder + "/" : ""
      }${filename}`;

    const params = {
      Body: decodedFile,
      Bucket: paramsOverride.bucket || null,
      Key: filePath
    };

    if (paramsOverride.kmsKey) {
      // const key = await getKey(paramsOverride.kmsKey, 'AES_256')
      params.ServerSideEncryption = "aws:kms";
      params.SSEKMSKeyId = paramsOverride.kmsKey;
    }

    const response = await S3.call("putObject", params);
    return _.assign(response, { filename });
  }

  /**
   * Returns signed url to get image from S3
   *
   * @param {string} imageType Type of image
   * @param {string} filename Filename of image
   * @param {object} paramsOverride Override default get options
   */
  getSignedURLForImage(imageType, filename, paramsOverride = {}) {
    const folderName =
      paramsOverride.folderName || bucketFolderNames[imageType];
    const filePath =
      paramsOverride.filePath ||
      `${folderName}/${
        paramsOverride.subfolder ? paramsOverride.subfolder + "/" : ""
      }${filename}`;

    const operationParametrs = {
      Bucket: paramsOverride.bucket || DEFAULT_BUCKET_NAME,
      Key: filePath
    };

    const signedURL = S3.getSignedUrl("getObject", operationParametrs);

    return signedURL;
  }

  /**
   * Removes image from S3 \
   * Returns S3 response
   * @param {string} imageType Type of image to remove
   * @param {string} filename Filename of image to remove
   * @param {object} paramsOverride Override default delete options
   */
  async removeImage(imageType, filename, paramsOverride = {}) {
    const folderName =
      paramsOverride.folderName || bucketFolderNames[imageType];
    const filePath =
      paramsOverride.filePath ||
      `${folderName}/${
        paramsOverride.subfolder ? paramsOverride.subfolder + "/" : ""
      }${filename}`;

    const params = {
      Bucket: paramsOverride.bucket || null,
      Key: filePath
    };

    const response = await S3.call("deleteObject", params);

    return response;
  }

  /**
   * Get image from S3 \
   * Returns S3 response
   * @param {string} imageType Type of image to remove
   * @param {string} filename Filename of image to remove
   * @param {object} paramsOverride Override default delete options
   */
  async getImage(imageType, filename, paramsOverride = {}) {
    const folderName =
      paramsOverride.folderName || bucketFolderNames[imageType];
    const filePath =
      paramsOverride.filePath ||
      `${folderName}/${
        paramsOverride.subfolder ? paramsOverride.subfolder + "/" : ""
      }${filename}`;

    const params = {
      Bucket: paramsOverride.bucket || null,
      Key: filePath
    };

    const response = await S3.call("getObject", params);

    return response;
  }

  /**
   * Updates images on S3\
   * Returns array of images filenames
   * @param {String} type Images type
   * @param {Array} images Array of images
   * @param {String} userId User's id
   */
  async updateImages(type, images, userId) {
    const params = {};
    const completedParams = _.assign(params, userId);

    const promises = images.map(image => {
      return new Promise((resolve, reject) => {
        if (_.isString(image)) {
          if (!!/(data:image\/.*?;base64),/g.exec(image)) {
            // new image
            this.putImage(
              {
                imageType: type,
                image
              },
              completedParams
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
            this.removeImage(type, image._id, completedParams)
              .then(() => resolve(null))
              .catch(err => reject(err));
          }
        }
      });
    });

    const imagesResults = await Promise.all(promises);

    return imagesResults.filter(filename => filename !== null);
  }
}

module.exports = new ImagesManager();
module.exports.ImagesManager = ImagesManager;
