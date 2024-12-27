const { Schema, model } = require("mongoose");

const topicSchema = new Schema(
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
    topic_title: {
      type: String,
      uppercase: true,
      required: true,
      minlength: [5, "Topic title kamida 5 ta belgidan iborat bo'lishi kerak"],
      maxlength: [100, "Topic title 100 ta belgidan oshmasligi kerak"],
      trim: true,
    },
    topic_text: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value.trim().length > 0; // Faqat bo'sh joylar yuborilmasligi
        },
        message: "Topic text bo'sh bo'lishi mumkin emas",
      },
    },
    is_checked: {
      type: Boolean,
      required: true,
    },
    is_approved: {
      type: Boolean,
      required: [
        function () {
          return this.is_checked;
        },
        "Tekshirilgan mavzuni tasdiqlangan yoki tasdiqlanmaganligini kiritish majburiy",
      ],
      validate: {
        validator: function (value) {
          if (!this.is_checked && value !== undefined) {
            return false; // is_checked false bo'lsa, is_approved yuborilmasligi kerak
          }
          return true;
        },
        message: "Tekshirilmagan mavzu uchun is_approved yuborilmasligi kerak",
      },
    },
    expert_id: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: [
        function () {
          return this.is_checked;
        },
        "Tekshirilgan mavzuli topic uchun export idsini kiritish majburiy",
      ],
      validate: [
        {
          validator: async function (value) {
            const Author = require("./Author");
            const author = await Author.findById(value);
            return !!author?.is_expert;
          },
          message: "Berilgan expert_id haqiqiy emas yoki ekspert emas",
        },
        {
          validator: function (value) {
            if (!this.is_checked && value !== undefined) {
              return false; // is_checked false bo'lsa, expert_id yuborilmasligi kerak
            }
            return true;
          },
          message: "Tekshirilmagan mavzu uchun expert_id yuborilmasligi kerak",
        },
      ],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("Topic", topicSchema);
