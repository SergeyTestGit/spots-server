const Yup = require("yup");

module.exports.validationSchema = Yup.object().shape({
  paymentMethod: Yup.string().required(),
  amount: Yup.number().required(),
  transactionId: Yup.string().required()
});
