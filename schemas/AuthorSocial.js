const { Schema, model } = require("mongoose");
const validator = require("validator");

const author_socialSchema = new Schema(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Author",
      validate: {
        validator: async function (value) {
          const Author = require("./Author");
          const author = await Author.findById(value);
          return !!author;
        },
        message: "Berilgan author_id haqiqiy emas",
      },
    },
    social_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Social",
      validate: {
        validator: async function (value) {
          const Social = require("./Social");
          const dictionary = await Social.findById(value);
          return !!dictionary;
        },
        message: "Berilgan social_id haqiqiy emas",
      },
    },
    social_link: {
      type: String,
      required: [true, "Social link majburiy"],
      validate: {
        validator: function (v) {
          return validator.isURL(v, {
            protocols: ["http", "https"],
            require_protocol: true,
          });
        },
        message: (props) =>
          `${props.value} haqiqiy URL formatida bo'lishi kerak!`,
      },
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("AuthorSocial", author_socialSchema);
