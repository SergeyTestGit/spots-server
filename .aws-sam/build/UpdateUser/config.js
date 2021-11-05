const Yup = require("yup");

module.exports.bodyValidationSchema = Yup.object().shape({
  avatarB64: Yup.string().notRequired(),
  firstName: Yup.string().notRequired(),
  lastName: Yup.string().notRequired(),
  birthdate: Yup.date().notRequired(),
  defaultRadius: Yup.number().notRequired(),
  geolocation: Yup.string()
    .matches(/([0-9]*\.?[0-9]*\/[0-9]*\.?[0-9]*)/)
    .nullable()
    .notRequired(),
  address: Yup.string().notRequired(),
  city: Yup.string().notRequired(),
  state: Yup.string().notRequired(),
  zip: Yup.string().notRequired(),
  country: Yup.string().notRequired(),
  isProvider: Yup.bool().notRequired(),
  isPro: Yup.bool().notRequired(),
  aboutYourself: Yup.string().notRequired(),
  certificates: Yup.array().notRequired(),
  picsOfWork: Yup.array().notRequired(),
  idPics: Yup.array().notRequired(),
  websiteLinks: Yup.array().notRequired(),
  videoLinks: Yup.array().notRequired(),
  services: Yup.array()
    .notRequired()
    .of(
      Yup.object().shape({
        categoryId: Yup.string().required(),
        serviceId: Yup.string().notRequired(),
        status: Yup.string()
          .required()
          .oneOf(["active", "inactive", "blocked"])
      })
    ),
  email: Yup.string()
    .email()
    .notRequired(),
  phoneNumber: Yup.string()
    .notRequired()
    .matches(/^[+][0-9]{1,2}[0-9]{10}$/),
  isAgreedWithTerms: Yup.bool().notRequired(),
  usedLanguage: Yup.string()
    .nullable()
    .notRequired(),
  preferredLanguage: Yup.string()
    .nullable()
    .notRequired()
});
