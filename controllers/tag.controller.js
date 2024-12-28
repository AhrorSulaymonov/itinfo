const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Tag = require("../schemas/Tag");
const { tagValidation } = require("../validations/tag.validation");

const addTag = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }
    const { category_id, topic_id } = req.body;
    const oldTag = await Tag.findOne({ category_id, topic_id });
    if (oldTag) {
      return res.status(400).send({ message: "This tag already exists" });
    }
    const newTag = await Tag.create({
      category_id,
      topic_id,
    });
    res.status(201).send({ message: "New tag added", newTag });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTags = async (req, res) => {
  try {
    const tages = await Tag.find()
      .populate("category_id", "-_id")
      .populate("topic_id");
    res.send({ tages });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTagById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const tag = await Tag.findOne({ _id: id })
      .populate("category_id", "-_id")
      .populate("topic_id", "-_id");
    if (!tag) {
      return res.status(400).send({ message: "Bunday tag mavjud emas" });
    }
    res.send({ tag });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTagsByCategory_idQuery = async (req, res) => {
  try {
    const category_id = req.query.category_id;
    const tages = await Tag.find({ category_id })
      .populate("category_id", "-_id")
      .populate("topic_id", "-_id");
    res.send({ tages });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTagsByTopic_idQuery = async (req, res) => {
  try {
    const topic_id = req.query.topic_id;
    const tages = await Tag.find({ topic_id })
      .populate("category_id", "-_id")
      .populate("topic_id", "-_id");
    res.send({ tages });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTagById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const tag = await Tag.deleteOne({ _id: id });
    res.send(tag);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTagById = async (req, res) => {
  try {
    const id = req.params.id;
    const { category_id, topic_id } = req.body;
    const newTag = await Tag.updateOne(
      { _id: id },
      {
        category_id,
        topic_id,
      }
    );
    res.send({ message: "Tag updated succesfully", newTag });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addTag,
  getTags,
  deleteTagById,
  getTagsByCategory_idQuery,
  getTagsByTopic_idQuery,
  updateTagById,
  getTagById,
};
