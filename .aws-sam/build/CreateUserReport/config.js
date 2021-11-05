const Yup = require("yup");

module.exports.validationSchema = Yup.object().shape({
  userId: Yup.string().required(),
  message: Yup.string().required()
});
