const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Category = require("../schemas/Category");
const Joi = require("joi");
const { categoryValidation } = require("../validations/category.validation");

const addCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }
    const { category_name, parent_category_id } = req.body;
    const oldCategory = await Category.findOne({ category_name });
    if (oldCategory) {
      return res.status(400).send({ message: "This category already exists" });
    }
    const newCategory = await Category.create({
      category_name,
      parent_category_id,
    });
    res.status(201).send({ message: "New category added", newCategory });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate(
      "parent_category_id",
      "-_id"
    );
    res.send({ categories });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCategorysByNameQuery = async (req, res) => {
  try {
    const searchQuery = req.query;
    const categories = await Category.find({
      category_name: new RegExp(searchQuery.name, "i"),
    }).populate("parent_category_id", "-_id");
    res.send({ categories });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const category = await Category.deleteOne({ _id: id });
    res.send(category);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const { category_name, parent_category_id } = req.body;

    const updateData = { category_name };
    if (parent_category_id) {
      updateData.parent_category_id = parent_category_id;
    }

    const newCategory = await Category.updateOne({ _id: id }, updateData);

    res.send({ message: "Category updated successfully", newCategory });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const category = await Category.findOne({ _id: id }).populate(
      "parent_category_id",
      "-_id"
    );
    if (!category) {
      return res.status(400).send({ message: "Bunday category mavjud emas" });
    }
    res.send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addCategory,
  getCategories,
  getCategorysByNameQuery,
  deleteCategoryById,
  updateCategoryById,
  getCategoryById,
};
