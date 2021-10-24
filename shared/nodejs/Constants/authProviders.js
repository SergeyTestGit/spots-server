const authProviders = {
  cognito: "cognito",
  google: "google",
  linkedin: "linkedin",
  facebook: "facebook"
};

const authProviderErrorSignInWith = {
  [authProviders.cognito]: "username and password",
  [authProviders.google]: "Google",
  [authProviders.linkedin]: "LinkedIn",
  [authProviders.facebook]: "Facebook"
};

const getSignInWithErrorMessage = (
  provider,
  prefix = "User already exists"
) => {
  return `${prefix}. Please Sign In with ${
    authProviderErrorSignInWith[provider]
  }`;
};

module.exports.authProviders = authProviders;
module.exports.authProviderErrorSignInWith = authProviderErrorSignInWith;
module.exports.getSignInWithErrorMessage = getSignInWithErrorMessage;
