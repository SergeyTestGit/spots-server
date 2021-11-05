const Yup = require("yup");

module.exports.validationSchema = Yup.object().shape({
  reviewedUserId: Yup.string().notRequired(),
  rate: Yup.number()
    .min(0)
    .max(5)
    .notRequired(),
  comment: Yup.string().notRequired()
});
