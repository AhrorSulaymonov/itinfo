const Joi = require("joi");

exports.synonymValidation = (data) => {
  const synonymSchema = Joi.object({
    desc_id: Joi.string()
      .alphanum()
      .message("description id noto'g'ri")
      .required()
      .messages({
        "string.empty": "desc_id nomi bo'sh bo'lishi mumkin emas",
        "any.required": "desc_id nomi kiritilishi shart",
      }),
    dict_id: Joi.string()
      .alphanum()
      .message("dictionary id noto'g'ri")
      .required()
      .messages({
        "string.empty": "dict_id nomi bo'sh bo'lishi mumkin emas",
        "any.required": "dict_id nomi kiritilishi shart",
      }),
  });

  return synonymSchema.validate(data, { abortEarly: false });
};
