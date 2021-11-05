const Yup = require("yup");

module.exports.validationSchema = Yup.object().shape({
  reviewedUserId: Yup.string().required(),
  rate: Yup.number()
    .min(0)
    .max(5)
    .required(),
  comment: Yup.string().notRequired(),
  jobId: Yup.string().required()
});
