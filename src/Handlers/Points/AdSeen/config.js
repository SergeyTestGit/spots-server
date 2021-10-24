const Yup = require("yup");

module.exports.validationSchema = Yup.object().shape({
  amount: Yup.number().required()
});
