const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      uppercase: true,
      required: true,
      trim: true,
    },
    user_email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,
    },
    user_password: {
      type: String,
      required: [true, "Parolni kiritish majburiy"],
      minlength: [6, "Parol 6ta belgidan ko'p bo'lishi kerak"],
    },
    user_info: {
      type: String,
      maxlength: [500, "Ma'lumot 500 belgidan oshmasligi kerak"],
    },
    user_photo: {
      type: String,
      validate: {
        validator: function (value) {
          return /\.(jpeg|jpg|png|gif)$/i.test(value);
        },
        message: (props) =>
          `${props.value} - rasm formati noto'g'ri (faqat jpg, jpeg, png, gif)`,
      },
    },
    user_is_active: {
      type: Boolean,
      default: false,
    },
    refresh_token: String,
    activation_link: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
