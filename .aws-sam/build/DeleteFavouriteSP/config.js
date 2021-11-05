const Yup = require("yup");

const valdiationSchema = Yup.object().shape({
  favouriteSpId: Yup.string().required()
});

module.exports.valdiationSchema = valdiationSchema;
