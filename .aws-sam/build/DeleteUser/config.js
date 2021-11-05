const Yup = require("yup");

const validationSchema = Yup.object().shape({
  deletionReason: Yup.string().required()
});

module.exports.validationSchema = validationSchema;
