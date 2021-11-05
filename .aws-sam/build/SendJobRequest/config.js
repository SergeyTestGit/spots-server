const Yup = require("yup");

const valdiationSchema = Yup.object().shape({
  jobId: Yup.string().required(),
  userId: Yup.string().required(),
  suggestedStartDate: Yup.date().notRequired(),
  suggestedBudget: Yup.number().notRequired()
});

module.exports.valdiationSchema = valdiationSchema;
