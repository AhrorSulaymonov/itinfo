const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Social = require("../schemas/Social");
const { socialValidation } = require("../validations/social.validation");

const addSocial = async (req, res) => {
  try {
    const { error, value } = socialValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }
    const { social_name, social_icon_file } = req.body;
    const oldSocial = await Social.findOne({ social_name, social_icon_file });
    if (oldSocial) {
      return res.status(400).send({ message: "This social already exists" });
    }
    const newSocial = await Social.create({
      social_name,
      social_icon_file,
    });
    res.status(201).send({ message: "New social added", newSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSocials = async (req, res) => {
  try {
    const socials = await Social.find();
    res.send({ socials });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSocialsByNameQuery = async (req, res) => {
  try {
    const searchQuery = req.query;
    const socials = await Social.find({
      social_name: new RegExp(searchQuery.name, "i"),
    });
    res.send({ socials });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const social = await Social.deleteOne({ _id: id });
    res.send(social);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    const { social_name, social_icon_file } = req.body;

    const newSocial = await Social.updateOne(
      { _id: id },
      {
        $set: {
          social_name,
          social_icon_file,
        },
      }
    );

    res.send({ message: "Social updated successfully", newSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const social = await Social.findOne({ _id: id });
    if (!social) {
      return res.status(400).send({ message: "Bunday social mavjud emas" });
    }
    res.send({ social });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addSocial,
  getSocials,
  getSocialsByNameQuery,
  deleteSocialById,
  updateSocialById,
  getSocialById,
};
