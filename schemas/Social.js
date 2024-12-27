const { Schema, model } = require("mongoose");

const socialSchema = new Schema(
  {
    social_name: {
      type: String,
      uppercase: true,
      required: [true, "Social nomi majburiy"],
      maxlength: [50, "Social nomi 50 belgidan oshmasligi kerak"],
      validate: {
        validator: function (v) {
          return /^[A-Z\s]+$/.test(v); // Faqat katta harflar va bo'sh joylar
        },
        message: (props) =>
          `${props.value} faqat katta harflar va bo'sh joylarni o'z ichiga olishi kerak!`,
      },
    },
    social_icon_file: {
      type: String,
      required: [true, "Icon fayli majburiy"],
      validate: {
        validator: function (v) {
          return /^.*\.(png|jpg|jpeg|svg|gif)$/i.test(v); // Faqat tasvir formatlari
        },
        message: (props) =>
          `${props.value} tasvir fayli bo'lishi kerak (png, jpg, jpeg, svg, gif)!`,
      },
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Social", socialSchema);
