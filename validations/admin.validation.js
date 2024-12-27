const Joi = require("joi");
exports.adminValidation = (data) => {
  const adminSchema = Joi.object({
    admin_name: Joi.string().required().messages({
      "string.empty": "admin_name  bo'sh bo'lishi mumkin emas",
      "any.required": "admin_name  kiritilishi shart",
    }),
    admin_email: Joi.string()
      .required()
      .messages({
        "string.empty": "admin_email nomi bo'sh bo'lishi mumkin emas",
        "any.required": "admin_email nomi kiritilishi shart",
      })
      .email()
      .lowercase(),
    admin_phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    admin_password: Joi.string()
      .required()
      .messages({
        "string.empty": "admin_password nomi bo'sh bo'lishi mumkin emas",
        "any.required": "admin_password nomi kiritilishi shart",
      })
      .pattern(new RegExp("^[a-zA-Z0-9!@# ]{3,30}$")),
    confirm_password: Joi.ref("admin_password"),
    is_expert: Joi.boolean().default(false),
    admin_is_active: Joi.boolean().default(true),
    admin_is_creator: Joi.boolean().default(false),
  });

  return adminSchema.validate(data, { abortEarly: false });
};
