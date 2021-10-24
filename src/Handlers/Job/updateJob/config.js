const Yup = require("yup");

module.exports.validationSchema = Yup.object().shape({
  category: Yup.string().notRequired(),
  service: Yup.string().notRequired(),
  title: Yup.string().notRequired(),
  doneBefore: Yup.date().notRequired(),
  expiryDate: Yup.date().notRequired(),
  description: Yup.string().notRequired(),
  budget: Yup.number()
    .min(0)
    .notRequired(),
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
    .notRequired()
});
