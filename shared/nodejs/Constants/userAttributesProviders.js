const moment = require("moment");

const userAttribProviders = {
  cognito: "cognito",
  dynamo: "dynamo"
};

module.exports.userFields = {
  isPremium: {
    provider: userAttribProviders.cognito,
    providerField: "custom:isPremium",
    process: val => `${+val}`
  },
  account_status: {
    provider: userAttribProviders.cognito,
    providerField: "custom:account_status"
  },
  settings_notif: {
    provider: userAttribProviders.cognito,
    providerField: "custom:settings_notif",
    process: val => `${+val}`
  },
  settings_job_allerts: {
    provider: userAttribProviders.cognito,
    providerField: "custom:settings_job_allerts",
    process: val => `${+val}`
  },
  deletion_reason: {
    provider: userAttribProviders.cognito,
    providerField: "custom:deletion_reason"
  },
  rate: {
    provider: userAttribProviders.cognito,
    providerField: "custom:rate",
    process: val => `${val}`
  },
  usedLanguage: {
    provider: userAttribProviders.cognito,
    providerField: "custom:usedLanguage"
  },
  preferredLanguage: {
    provider: userAttribProviders.cognito,
    providerField: "custom:preferredLanguage"
  },
  geolocation: {
    provider: userAttribProviders.cognito,
    providerField: "custom:geolocation"
  },
  isAgreedWithTerms: {
    provider: userAttribProviders.cognito,
    providerField: "custom:isAgreedWithTerms",
    process: val => `${+val}`
  },
  authProvider: {
    provider: userAttribProviders.cognito,
    providerField: "custom:authProvider"
  },
  emailVerified: {
    provider: userAttribProviders.cognito,
    providerField: "email_verified"
  },
  website: {
    provider: userAttribProviders.cognito,
    providerField: "website"
  },
  picture: {
    provider: userAttribProviders.cognito,
    providerField: "picture"
  },
  phoneNumber: {
    provider: userAttribProviders.cognito,
    providerField: "phone_number"
  },
  nickname: {
    provider: userAttribProviders.cognito,
    providerField: "nickname"
  },
  name: {
    provider: userAttribProviders.cognito,
    providerField: "name"
  },
  middleName: {
    provider: userAttribProviders.cognito,
    providerField: "middle_name"
  },
  locale: {
    provider: userAttribProviders.cognito,
    providerField: "locale"
  },
  gender: {
    provider: userAttribProviders.cognito,
    providerField: "gender"
  },
  email: {
    provider: userAttribProviders.cognito,
    providerField: "email"
  },
  avatarB64: {
    provider: userAttribProviders.cognito,
    providerField: "custom:avatarURL"
  },
  firstName: {
    provider: userAttribProviders.cognito,
    providerField: "given_name"
  },
  lastName: {
    provider: userAttribProviders.cognito,
    providerField: "family_name"
  },
  birthdate: {
    provider: userAttribProviders.cognito,
    providerField: "birthdate",
    process: date => moment(date).format("YYYY-MM-DD")
  },
  address: {
    provider: userAttribProviders.cognito,
    providerField: "address"
  },
  city: {
    provider: userAttribProviders.cognito,
    providerField: "custom:city"
  },
  state: {
    provider: userAttribProviders.cognito,
    providerField: "custom:state"
  },
  zip: {
    provider: userAttribProviders.cognito,
    providerField: "custom:zip"
  },
  country: {
    provider: userAttribProviders.cognito,
    providerField: "custom:country"
  },
  isProvider: {
    provider: userAttribProviders.cognito,
    providerField: "custom:isProvider",
    process: val => `${+val}`
  },
  aboutYourself: {
    provider: userAttribProviders.cognito,
    providerField: "custom:about"
  },
  certificates: {
    provider: userAttribProviders.dynamo,
    providerField: "certificates"
  },
  picsOfWork: {
    provider: userAttribProviders.dynamo,
    providerField: "picsOfWork"
  },
  idPics: {
    provider: userAttribProviders.cognito,
    providerField: "custom:idPics"
  },
  websiteLinks: {
    provider: userAttribProviders.dynamo,
    providerField: "websiteLinks"
  },
  videoLinks: {
    provider: userAttribProviders.dynamo,
    providerField: "videoLinks"
  },
  services: {
    provider: userAttribProviders.dynamo,
    providerField: "services"
  },
  isPro: {
    provider: userAttribProviders.cognito,
    providerField: "custom:isPro",
    process: val => `${+val}`
  },
  defaultRadius: {
    provider: userAttribProviders.dynamo,
    providerField: "defaultRadius"
  },
  isIdVerified: {
    provider: userAttribProviders.cognito,
    providerField: "custom:isIdVerified",
    process: val => `${+val}`
  }
};

module.exports.userAttribProviders = userAttribProviders;
