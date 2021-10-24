const yup = require("yup");

// check basic information is entered:  name, address,phone number and emal
// with email verification always on, but phone only when we decide

let phone_number_verified_schema = yup
  .string("phoneNumberNotVerified")
  .required("phoneNumberNotVerified")
  .oneOf(["true"], "phoneNumberNotVerified");

if (process.env.SHOULD_PHONE_BE_VERIFIED_IN_COMPLETE_PROFILE === "false") {
  phone_number_verified_schema = yup.string().notRequired();
}

const completeProfileValidationSchema = yup.object().shape({
  email: yup.string().required("emailRequired"),
  phone_number: yup.string().required("phoneNumberRequired"),
  given_name: yup
    .string("firstNameRequired")
    .min(1, "firstNameRequired")
    .required("firstNameRequired"),
  family_name: yup
    .string("lastNameRequired")
    .min(1, "lastNameRequired")
    .required("lastNameRequired"),
  geolocation: yup
    .string("geolocationRequired")
    .matches(/([0-9]*\.?[0-9]*\/[0-9]*\.?[0-9]*)/, "geolocationRequired")
    .required("geolocationRequired"),
  phone_number_verified: phone_number_verified_schema,
  email_verified: yup
    .string("emailNotVerified")
    .required("emailNotVerified")
    .oneOf(["true"], "emailNotVerified")
});

module.exports = userProfile => {
  try {
    completeProfileValidationSchema.validateSync(userProfile, {
      strict: true,
      abortEarly: false
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      throw {
        code: "profileNotComplete",
        message: "Profile isn't complete",
        details: error.errors
      };
    } else {
      throw error;
    }
  }
};
