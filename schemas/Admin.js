const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    admin_name: {
      type: String,
      uppercase: true,
      required: true,
      trim: true,
    },
    admin_email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,
    },
    admin_phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (value) {
          return /^\d{2}-\d{3}-\d{2}-\d{2}$/.test(value);
        },
        message: (props) =>
          `${props.value} - telefon raqami noto'g'ri formatda`,
      },
    },
    admin_password: {
      type: String,
      required: [true, "Parolni kiritish majburiy"],
      minlength: [6, "Parol 6ta belgidan ko'p bo'lishi kerak"],
    },
    admin_is_active: {
      type: Boolean,
      default: true,
    },
    admin_is_creator: {
      type: Boolean,
      default: false,
    },
    refresh_token: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("Admin", adminSchema);
