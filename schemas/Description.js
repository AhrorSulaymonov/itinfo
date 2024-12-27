const { Schema, model } = require("mongoose");

const descriptionSchema = new Schema(
  {
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
    description: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Description", descriptionSchema);
