const Yup = require("yup");

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required(),
  newPassword: Yup.string().required()
});

module.exports.validationSchema = validationSchema;
