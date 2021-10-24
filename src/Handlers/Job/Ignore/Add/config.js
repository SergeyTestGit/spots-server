const Yup = require("yup");

const valdiationSchema = Yup.object().shape({
  jobId: Yup.string().required()
});

module.exports.valdiationSchema = valdiationSchema;
