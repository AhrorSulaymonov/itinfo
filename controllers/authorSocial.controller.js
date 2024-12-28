const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const AuthorSocial = require("../schemas/AuthorSocial");
const {
  authorSocialValidation,
} = require("../validations/authorSocial.validation");

const addAuthorSocial = async (req, res) => {
  try {
    const { error, value } = authorSocialValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }
    const { author_id, social_id, social_link } = req.body;
    const newAuthorSocial = await AuthorSocial.create({
      author_id,
      social_id,
      social_link,
    });
    res
      .status(201)
      .send({ message: "New authorSocial added", newAuthorSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthorSocials = async (req, res) => {
  try {
    const authorSocials = await AuthorSocial.find()
      .populate("author_id")
      .populate("social_id");
    res.send({ authorSocials });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAuthorSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const authorSocial = await AuthorSocial.deleteOne({ _id: id });
    res.send(authorSocial);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAuthorSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    const { author_id, social_id, social_link } = req.body;
    const newAuthorSocial = await AuthorSocial.updateOne(
      { _id: id },
      {
        $set: {
          author_id,
          social_id,
          social_link,
        },
      }
    );

    res.send({ message: "AuthorSocial updated successfully", newAuthorSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthorSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const authorSocial = await AuthorSocial.findOne({ _id: id })
      .populate("author_id")
      .populate("social_id");
    if (!authorSocial) {
      return res
        .status(400)
        .send({ message: "Bunday authorSocial mavjud emas" });
    }
    res.send({ authorSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addAuthorSocial,
  getAuthorSocials,
  deleteAuthorSocialById,
  updateAuthorSocialById,
  getAuthorSocialById,
};
