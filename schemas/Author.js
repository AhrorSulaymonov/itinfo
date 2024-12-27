const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    author_first_name: {
      type: String,
      required: [true, "Ismni kiritish majburiy"],
      trim: true,
      uppercase: true,
      maxlength: [50, "Ism 50 belgidan oshmasligi kerak"],
    },
    author_last_name: {
      type: String,
      required: [true, "Familiyani kiritish majburiy"],
      trim: true,
      uppercase: true,
      maxlength: [50, "Familiya 50 belgidan oshmasligi kerak"],
    },
    author_nick_name: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [30, "Taxallus 30 belgidan kam bo'lishi kerak"],
    },
    author_email: {
      type: String,
      required: [true, "Emailni kiritish majburiy"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
        "Email format noto'g'ri",
      ],
    },
    author_phone: {
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
    author_password: {
      type: String,
      required: [true, "Parolni kiritish majburiy"],
      minlength: [6, "Parol 6ta belgidan ko'p bo'lishi kerak"],
    },
    author_info: {
      type: String,
      maxlength: [500, "Ma'lumot 500 belgidan oshmasligi kerak"],
    },
    author_position: {
      type: String,
      maxlength: [100, "Lavozim nomi 100 belgidan oshmasligi kerak"],
    },
    author_photo: {
      type: String,
      validate: {
        validator: function (value) {
          return /\.(jpeg|jpg|png|gif)$/i.test(value);
        },
        message: (props) =>
          `${props.value} - rasm formati noto'g'ri (faqat jpg, jpeg, png, gif)`,
      },
    },
    is_expert: {
      type: Boolean,
      default: false,
    },
    author_is_active: {
      type: Boolean,
      default: false,
    },
    refresh_token: String,
    activation_link: String,
  },
  {
    versionKey: false,
    timestamps: true, // createdAt va updatedAt qo'shiladi
  }
);

module.exports = model("Author", authorSchema);
