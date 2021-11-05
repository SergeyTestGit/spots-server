const yup = require("yup");

module.exports.validationSchema = yup.object().shape({
  username: yup.string().required()
});
