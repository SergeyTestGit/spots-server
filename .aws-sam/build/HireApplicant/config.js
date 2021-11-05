const Yup = require("yup");

const valdiationSchema = Yup.object().shape({
  jobId: Yup.string().required(),
  userId: Yup.string().required(),
  startDate: Yup.date().required(),
  budget: Yup.number()
    .min(0)
    .notRequired(),
  currency: Yup.string().notRequired()
});

module.exports.valdiationSchema = valdiationSchema;
