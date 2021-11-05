const Yup = require("yup");

const lengthUnits = require("/opt/nodejs/Constants/distanceUnit");
const orderByTypes = require("/opt/nodejs/Constants/orderByTypes");

const allowedOrderTypes = ["asc", "desc"];

const defaultParams = {
  elements_per_page: 10,
  order_by: "distance",
  order: "asc",
  page_number: 0
};

const validationSchema = Yup.object().shape({
  /* order, pagination params */
  elements_per_page: Yup.number()
    .positive()
    .default(defaultParams.elements_per_page)
    .required(),
  page_number: Yup.number()
    .positive()
    .default(0)
    .required(),
  order_by: Yup.string()
    .oneOf(Object.keys(orderByTypes.job))
    .default(defaultParams.order_by)
    .required(),
  order: Yup.string()
    .oneOf(allowedOrderTypes)
    .default(defaultParams.order)
    .required(),
  /* filters params */
  author: Yup.string().notRequired(),
  categories: Yup.array()
    .of(Yup.string())
    .notRequired(),
  keywords: Yup.string().notRequired(),
  geolocation: Yup.string()
    .matches(/([0-9]*\.?[0-9]*\/[0-9]*\.?[0-9]*)/)
    .notRequired(),
  radius: Yup.number()
    .positive()
    .notRequired(),
  length_units: Yup.string().oneOf(Object.keys(lengthUnits)),
  no_geolocation_filter: Yup.string().notRequired()
});

module.exports.defaultParams = defaultParams;
module.exports.validationSchema = validationSchema;
