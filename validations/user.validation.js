const Joi = require("joi");

exports.userValidation = (data) => {
  const userSchema = Joi.object({
    user_name: Joi.string().required().messages({
      "string.empty": "user_name nomi bo'sh bo'lishi mumkin emas",
      "any.required": "user_name nomi kiritilishi shart",
    }),
    user_email: Joi.string()
      .required()
      .messages({
        "string.empty": "user_email nomi bo'sh bo'lishi mumkin emas",
        "any.required": "user_email nomi kiritilishi shart",
      })
      .email()
      .lowercase(),
    user_password: Joi.string()
      .required()
      .messages({
        "string.empty": "user_password nomi bo'sh bo'lishi mumkin emas",
        "any.required": "user_password nomi kiritilishi shart",
      })
      .pattern(new RegExp("^[a-zA-Z0-9!@# ]{3,30}$")),
    confirm_password: Joi.ref("user_password"),
    user_info: Joi.string(),
    user_photo: Joi.string().default("/user/avatar.png"),
    user_is_active: Joi.boolean().default(false),
  });
  return userSchema.validate(data, { abortEarly: false });
};
