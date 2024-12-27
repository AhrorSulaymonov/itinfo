const Joi = require("joi");

exports.socialValidation = (data) => {
  const socialSchema = Joi.object({
    social_name: Joi.string()
      .required()
      .messages({
        "string.empty": "Social nomi bo'sh bo'lishi mumkin emas",
        "any.required": "Social nomi kiritilishi shart",
      })
      .max(50)
      .message("Social nomi 50 belgidan oshmasligi kerak"),
    social_icon_file: Joi.string()
      .required()
      .messages({
        "string.empty": "Social nomi bo'sh bo'lishi mumkin emas",
        "any.required": "Social nomi kiritilishi shart",
      })
      .default("/social/icon.png"),
  });

  return socialSchema.validate(data, { abortEarly: false });
};
