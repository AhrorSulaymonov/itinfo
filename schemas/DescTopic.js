const { Schema, model } = require("mongoose");

const descTopicSchema = new Schema(
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
  },
  {
    versionKey: false,
  }
);

module.exports = model("DescTopic", descTopicSchema);
