const { Schema, model } = require("mongoose");

const synonymSchema = new Schema(
  {
    desc_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Description",
      validate: {
        validator: async function (value) {
          const Description = require("./Description");
          const description = await Description.findById(value);
          return !!description;
        },
        message: "Berilgan desc_id haqiqiy emas",
      },
    },
    dict_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Dictionary",
      validate: {
        validator: async function (value) {
          const Dictionary = require("./Dictionary");
          const dictionary = await Dictionary.findById(value);
          return !!dictionary;
        },
        message: "Berilgan dict_id haqiqiy emas",
      },
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Synonym", synonymSchema);
