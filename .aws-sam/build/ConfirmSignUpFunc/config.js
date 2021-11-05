const yup = require("yup");

module.exports.validationSchema = yup.object().shape({
  verificationCode: yup.string().required(),
  username: yup.string().required()
});
