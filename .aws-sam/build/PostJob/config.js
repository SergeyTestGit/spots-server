const Yup = require("yup");

const { currencyCodesList } = require("/opt/nodejs/Constants/currency");

module.exports.validationSchema = Yup.object().shape({
  _id: Yup.string().required(),
  category: Yup.string().required(),
  service: Yup.string().notRequired(),
  title: Yup.string().required(),
  doneBefore: Yup.date().required(),
  expiryDate: Yup.date().required(),
  description: Yup.string().notRequired(),
  currency: Yup.string()
    .oneOf(currencyCodesList)
    .required(),
  budget: Yup.number()
    .required()
    .min(0),
  pics: Yup.array()
    .of(Yup.string())
    .notRequired(),
  videoLinks: Yup.array()
    .of(Yup.string().url())
    .notRequired(),
  streetAddress: Yup.string().notRequired(),
  city: Yup.string().notRequired(),
  state: Yup.string().notRequired(),
  zipCode: Yup.string().notRequired(),
  country: Yup.string().notRequired(),
  geolocation: Yup.string()
    .matches(/([0-9]*\.?[0-9]*\/[0-9]*\.?[0-9]*)/)
    .required()
});
