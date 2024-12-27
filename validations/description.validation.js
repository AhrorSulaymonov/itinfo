const Joi = require("joi");

exports.descriptionValidation = (data) => {
  const descriptionSchema = Joi.object({
    category_id: Joi.string().alphanum().message("ID noto'g'ri"),
    description: Joi.string()
      .required()
      .messages({
        "string.empty": "description bo'sh bo'lishi mumkin emas",
        "any.required": "description kiritilishi shart",
      })
      .trim(),
  });

  return ({ error, value } = descriptionSchema.validate(data, {
    abortEarly: false,
  }));
};
