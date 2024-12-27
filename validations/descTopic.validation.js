const Joi = require("joi");

exports.descTopicValidation = (data) => {
  const descTopicSchema = Joi.object({
    desc_id: Joi.string()
      .required()
      .messages({
        "string.empty": "desc_id nomi bo'sh bo'lishi mumkin emas",
        "any.required": "desc_id nomi kiritilishi shart",
      })
      .alphanum()
      .message("description id noto'g'ri"),
    topic_id: Joi.string()
      .required()
      .messages({
        "string.empty": "topic_id nomi bo'sh bo'lishi mumkin emas",
        "any.required": "topic_id nomi kiritilishi shart",
      })
      .alphanum()
      .message("topic id noto'g'ri"),
  });

  return descTopicSchema.validate(data, { abortEarly: false });
};
