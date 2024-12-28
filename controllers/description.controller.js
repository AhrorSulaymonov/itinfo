const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Description = require("../schemas/Description");
const {
  descriptionValidation,
} = require("../validations/description.validation");

const addDescription = async (req, res) => {
  try {
    const { error, value } = descriptionValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }
    const { category_id, description } = req.body;
    const oldDescription = await Description.findOne({
      category_id,
      description,
    });
    if (oldDescription) {
      return res
        .status(400)
        .send({ message: "This description already exists" });
    }
    const newDescription = await Description.create({
      category_id,
      description,
    });
    res.status(201).send({ message: "New description added", newDescription });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDescriptions = async (req, res) => {
  try {
    const descriptions = await Description.find().populate("category_id");
    res.send({ descriptions });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDescriptionById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const description = await Description.findOne({ _id: id });
    if (!description) {
      return res
        .status(400)
        .send({ message: "Bunday description mavjud emas" });
    }
    res.send({ description });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDescriptionsBycategory_idQuery = async (req, res) => {
  try {
    const searchQuery = req.query;
    const descriptiones = await Description.find({
      category_id: searchQuery.category_id,
    });
    res.send({ descriptiones });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteDescriptionById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const description = await Description.deleteOne({ _id: id });
    res.send(description);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateDescriptionById = async (req, res) => {
  try {
    const id = req.params.id;
    const { category_id, description } = req.body;
    const newDescription = await Description.updateOne(
      { _id: id },
      {
        category_id,
        description,
      }
    );
    res.send({ message: "Description updated succesfully", newDescription });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addDescription,
  getDescriptions,
  deleteDescriptionById,
  getDescriptionsBycategory_idQuery,
  updateDescriptionById,
  getDescriptionById,
};
