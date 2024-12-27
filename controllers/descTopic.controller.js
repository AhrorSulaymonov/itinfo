const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const DescTopic = require("../schemas/DescTopic");
const { descTopicValidation } = require("../validations/descTopic.validation");

const addDescTopic = async (req, res) => {
  try {
    const { error, value } = descTopicValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }
    const { desc_id, topic_id } = req.body;
    const oldDescTopic = await DescTopic.findOne({ desc_id, topic_id });
    if (oldDescTopic) {
      return res.status(400).send({ message: "This descTopic already exists" });
    }
    const newDescTopic = await DescTopic.create({
      desc_id,
      topic_id,
    });
    res.status(201).send({ message: "New descTopic added", newDescTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDescTopics = async (req, res) => {
  try {
    const descTopices = await DescTopic.find()
      .populate("desc_id", "-_id")
      .populate("topic_id", "-_id");
    res.send({ descTopices });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDescTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const descTopic = await DescTopic.findOne({ _id: id })
      .populate("desc_id", "-_id")
      .populate("topic_id", "-_id");
    if (!descTopic) {
      return res.status(400).send({ message: "Bunday descTopic mavjud emas" });
    }
    res.send({ descTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDescTopicsByDesc_idQuery = async (req, res) => {
  try {
    const desc_id = req.query.desc_id;
    const descTopices = await DescTopic.find({ desc_id })
      .populate("desc_id", "-_id")
      .populate("topic_id", "-_id");
    res.send({ descTopices });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDescTopicsByTopic_idQuery = async (req, res) => {
  try {
    const topic_id = req.query.topic_id;
    const descTopices = await DescTopic.find({ topic_id })
      .populate("desc_id", "-_id")
      .populate("topic_id", "-_id");
    res.send({ descTopices });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteDescTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const descTopic = await DescTopic.deleteOne({ _id: id });
    console.log(descTopic);
    res.send(descTopic);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateDescTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    const { desc_id, topic_id } = req.body;
    const newDescTopic = await DescTopic.updateOne(
      { _id: id },
      {
        desc_id,
        topic_id,
      }
    );
    res.send({ message: "DescTopic updated succesfully", newDescTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addDescTopic,
  getDescTopics,
  deleteDescTopicById,
  getDescTopicsByDesc_idQuery,
  getDescTopicsByTopic_idQuery,
  updateDescTopicById,
  getDescTopicById,
};
