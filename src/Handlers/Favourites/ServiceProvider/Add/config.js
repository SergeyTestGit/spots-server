const Yup = require("yup");

const valdiationSchema = Yup.object().shape({
  spId: Yup.string().required()
});

module.exports.valdiationSchema = valdiationSchema;
