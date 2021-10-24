const Yup = require("yup");

const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required()
});

module.exports.validationSchema = validationSchema;
