const Yup = require("yup");

module.exports.validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
  confirmationCode: Yup.string().required()
});
