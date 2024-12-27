const Joi = require("joi");

exports.authorSocialValidation = (data) => {
  const authorSocialSchema = Joi.object({
    author_id: Joi.string().alphanum().message("author id noto'g'ri"),
    social_id: Joi.string().alphanum().message("social id noto'g'ri"),
    social_link: Joi.string().uri(),
  });

  return authorSocialSchema.validate(data, { abortEarly: false });
};
