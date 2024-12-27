const Joi = require("joi");

const authorFullName = (parent) => {
  return parent.author_first_name + " " + parent.author_last_name;
};

exports.authorValidation = (data) => {
  const authorSchema = Joi.object({
    author_first_name: Joi.string().required().messages({
      "string.empty": "author_first_name nomi bo'sh bo'lishi mumkin emas",
      "any.required": "author_first_name nomi kiritilishi shart",
    }),
    author_last_name: Joi.string(),
    author_full_name: Joi.string().default(authorFullName),
    author_nick_name: Joi.string().min(2).max(20),
    author_password: Joi.string().pattern(
      new RegExp("^[a-zA-Z0-9!@# ]{3,30}$")
    ),
    confirm_password: Joi.ref("password"),
    author_email: Joi.string()
      .required()
      .messages({
        "string.empty": "author_email bo'sh bo'lishi mumkin emas",
        "any.required": "author_email kiritilishi shart",
      })
      .email()
      .lowercase(),
    author_phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    author_info: Joi.string(),
    author_position: Joi.string(),
    author_photo: Joi.string().default("/author/avatar.png"),
    is_expert: Joi.boolean().default(false),
    author_is_active: Joi.boolean().default(false),
    gender: Joi.string().valid("erkak", "ayol"),
    birth_date: Joi.date().less("2000-01-01"),
    birth_year: Joi.number().integer().min(1980).max(1999),
    referred: Joi.boolean().default(false),
    referredDetails: Joi.string().when("referred", {
      is: true,
      then: Joi.string().required().messages({
        "string.empty": "referredDetails nomi bo'sh bo'lishi mumkin emas",
        "any.required": "referredDetails nomi kiritilishi shart",
      }),
      otherwise: Joi.string().optional(),
    }),
    coding_langs: Joi.array().items(Joi.string(), Joi.number()),
    is_yes: Joi.boolean().truthy("YES", "HA").valid(true),
  });

  return authorSchema.validate(data, { abortEarly: false });
};
