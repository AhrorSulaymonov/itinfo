const Joi = require("joi");

exports.tagValidation = (data) => {
  const tagSchema = Joi.object({
    topic_id: Joi.string()
      .alphanum()
      .message("topic id noto'g'ri")
      .required()
      .messages({
        "string.empty": "topic_id nomi bo'sh bo'lishi mumkin emas",
        "any.required": "topic_id nomi kiritilishi shart",
      }),
    category_id: Joi.string()
      .alphanum()
      .message("category id noto'g'ri")
      .required()
      .messages({
        "string.empty": "category_id nomi bo'sh bo'lishi mumkin emas",
        "any.required": "category_id nomi kiritilishi shart",
      }),
  });

  return tagSchema.validate(data, { abortEarly: false });
};
