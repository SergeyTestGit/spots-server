const Yup = require("yup");

module.exports.validationSchema = Yup.object().shape({
  paymentMethod: Yup.string().required(),
  subscriptionType: Yup.string().required()
});
