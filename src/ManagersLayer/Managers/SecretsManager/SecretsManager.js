const { awsSecretsManager } = require("./AWSSecretsManager");

class SecretsManager {
  getSecretValue(secretName) {
    return new Promise((resolve, reject) => {
      awsSecretsManager.getSecretValue({ SecretId: secretName }, function(
        err,
        data
      ) {
        console.log({ err, data });
        if (err) {
          if (err.code === "DecryptionFailureException")
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            return reject(err);
          else if (err.code === "InternalServiceErrorException")
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            return reject(err);
          else if (err.code === "InvalidParameterException")
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            return reject(err);
          else if (err.code === "InvalidRequestException")
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            return reject(err);
          else if (err.code === "ResourceNotFoundException")
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            return reject(err);
        } else {
          let secret = "";

          // Decrypts secret using the associated KMS CMK.
          // Depending on whether the secret is a string or binary, one of these fields will be populated.
          if ("SecretString" in data) {
            secret = data.SecretString;
          } else {
            let buff = new Buffer(data.SecretBinary, "base64");
            secret = buff.toString("ascii");
          }

          resolve(secret);
        }
      });
    });
  }
}

module.exports = SecretsManager;
