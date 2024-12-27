const Joi = require("joi");

exports.dictionaryValidation = (data) => {
  const dictionarySchema = Joi.object({
    term: Joi.string()
      .required()
      .messages({
        "string.empty": "term nomi bo'sh bo'lishi mumkin emas",
        "any.required": "term nomi kiritilishi shart",
      })
      .uppercase()
      .trim(),
  });

  return dictionarySchema.validate(data, { abortEarly: false, convert: true });
};
