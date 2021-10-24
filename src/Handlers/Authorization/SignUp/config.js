const Yup = require("yup");

const { phoneNumberRegex } = require("/opt/Helpers/validation");

const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  phoneNumber: Yup.string()
    .required()
    .matches(phoneNumberRegex)
});

module.exports.validationSchema = validationSchema;
