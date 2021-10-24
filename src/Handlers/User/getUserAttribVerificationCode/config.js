const Yup = require("yup");

const validationSchema = Yup.object().shape({
  attributeName: Yup.string()
    .oneOf(["email", "phone_number"])
    .required()
});

module.exports.validationSchema = validationSchema;
