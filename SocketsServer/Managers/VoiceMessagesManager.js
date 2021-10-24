const s3 = require("../Libs/S3.lib");

const { VOICE_MESSAGES_BUCKET_NAME } = require("../Constants/s3.constants");

class VoiceMessagesManager {
  /**
   * Put voice message to S3 bucket
   * Returns S3 response
   *
   * @param {object} path path to audio-file
   */
  async putVoiceMessage(file) {
    const { originalname, buffer } = file;
    const fileExt = originalname;
    const fileName = Date.now().toString();

    return new Promise((resolve, reject) => {
      s3.upload(
        {
          Bucket: VOICE_MESSAGES_BUCKET_NAME,
          Key: `${fileName}.${fileExt}`,
          Body: buffer
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  }
}

module.exports = new VoiceMessagesManager();
module.exports.VoiceMessagesManager = VoiceMessagesManager;
