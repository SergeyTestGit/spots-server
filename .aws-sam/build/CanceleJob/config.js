const Yup = require("yup");

const valdiationSchema = Yup.object().shape({
  reason: Yup.string().required()
});

module.exports.valdiationSchema = valdiationSchema;
