const Joi = require("joi");

exports.topicValidation = (data) => {
  const topicSchema = Joi.object({
    author_id: Joi.string()
      .alphanum()
      .message("author_id noto'g'ri")
      .required()
      .messages({
        "string.empty": "author_id nomi bo'sh bo'lishi mumkin emas",
        "any.required": "author_id nomi kiritilishi shart",
      }),
    topic_title: Joi.string()
      .uppercase()
      .required()
      .messages({
        "string.empty": "topic_title nomi bo'sh bo'lishi mumkin emas",
        "any.required": "topic_title nomi kiritilishi shart",
      })
      .min(5)
      .message("Topic title kamida 5 ta belgidan iborat bo'lishi kerak")
      .max(100)
      .message("Topic title 100 ta belgidan oshmasligi kerak")
      .trim(),
    topic_text: Joi.string().required().messages({
      "string.empty": "topic_text bo'sh bo'lishi mumkin emas",
      "any.required": "topic_text kiritilishi shart",
    }),
    is_checked: Joi.boolean().default(false).required(),
    is_approved: Joi.boolean().when("is_checked", {
      is: true,
      then: Joi.boolean().required(),
      otherwise: Joi.boolean().optional(),
    }),
    expert_id: Joi.string()
      .alphanum()
      .message("author_id noto'g'ri")
      .when("is_checked", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      })
      .messages({
        "string.empty": "author_id nomi bo'sh bo'lishi mumkin emas",
        "any.required": "author_id nomi kiritilishi shart",
      }),
  });

  return topicSchema.validate(data, { abortEarly: false, convert: true });
};
