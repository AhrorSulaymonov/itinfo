const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Topic = require("../schemas/Topic");
const { topicValidation } = require("../validations/topic.validation");

const addTopic = async (req, res) => {
  try {
    const { error, value } = topicValidation(req.body);
    console.log(value);
    if (error) {
      return errorHandler(error, res);
    }
    const {
      author_id,
      topic_title,
      topic_text,
      is_checked,
      is_approved,
      expert_id,
    } = req.body;
    const newTopic = await Topic.create({
      author_id,
      topic_title,
      topic_text,
      is_checked,
      is_approved,
      expert_id,
    });
    res.status(201).send({ message: "New topic added", newTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("author_id")
      .populate("expert_id");
    res.send({ topics });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTopicsByTitleQuery = async (req, res) => {
  try {
    const searchQuery = req.query;
    const topics = await Topic.find({
      topic_title: new RegExp(searchQuery.title, "i"),
    })
      .populate("author_id")
      .populate("expert_id");
    res.send({ topics });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const topic = await Topic.deleteOne({ _id: id });
    console.log(topic);
    res.send(topic);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      author_id,
      topic_title,
      topic_text,
      is_checked,
      is_approved,
      expert_id,
    } = req.body;

    const updateFields = {
      author_id,
      topic_title,
      topic_text,
      is_checked,
    };

    // Agar is_checked false bo'lsa, expert_id va is_approved o'chiriladi
    if (!is_checked) {
      updateFields.expert_id = undefined; // unset qilish uchun
      updateFields.is_approved = undefined; // unset qilish uchun
    } else {
      // Agar true bo'lsa va qiymatlar kelgan bo'lsa, yangilanadi
      if (is_approved !== undefined) updateFields.is_approved = is_approved;
      if (expert_id) updateFields.expert_id = expert_id;
    }

    const updatedTopic = await Topic.updateOne(
      { _id: id },
      {
        $set: updateFields,
        ...(updateFields.expert_id === undefined && {
          $unset: { expert_id: 1 },
        }),
        ...(updateFields.is_approved === undefined && {
          $unset: { is_approved: 1 },
        }),
      }
    );

    res.send({ message: "Topic updated successfully", updatedTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const topic = await Topic.findOne({ _id: id })
      .populate("author_id")
      .populate("expert_id");
    if (!topic) {
      return res.status(400).send({ message: "Bunday topic mavjud emas" });
    }
    res.send({ topic });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addTopic,
  getTopics,
  deleteTopicById,
  updateTopicById,
  getTopicById,
  getTopicsByTitleQuery,
};
