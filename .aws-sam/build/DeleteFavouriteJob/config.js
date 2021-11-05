const Yup = require("yup");

const valdiationSchema = Yup.object().shape({
  favouriteJobId: Yup.string().required()
});

module.exports.valdiationSchema = valdiationSchema;
