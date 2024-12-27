const { Schema, model } = require("mongoose");

const tagSchema = new Schema(
  {
    topic_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Topic",
      validate: {
        validator: async function (value) {
          const Topic = require("./Topic");
          const topic = await Topic.findById(value);
          return !!topic;
        },
        message: "Berilgan topic_id haqiqiy emas",
      },
    },
    category_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
      validate: {
        validator: async function (value) {
          const Category = require("./Category");
          const category = await Category.findById(value);
          return !!category;
        },
        message: "Berilgan category_id haqiqiy emas",
      },
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Tag", tagSchema);
