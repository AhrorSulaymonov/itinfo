const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Dictionary = require("../schemas/Dictionary");
const {
  dictionaryValidation,
} = require("../validations/dictionary.validation");

const addTerm = async (req, res) => {
  try {
    const { error, value } = dictionaryValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }
    const { term } = req.body;
    const oldTerm = await Dictionary.findOne({ term });
    if (oldTerm) {
      return res.status(400).send({ message: "This term already exists" });
    }
    const newTerm = await Dictionary.create({ term, letter: term[0] });
    res.status(201).send({ message: "New term added", newTerm });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTerms = async (req, res) => {
  try {
    const terms = await Dictionary.find();
    res.send({ terms });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTermsByLetter = async (req, res) => {
  try {
    const letter = req.query.letter;
    const terms = await Dictionary.find({ letter });
    res.send({ terms });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTermsByName = async (req, res) => {
  try {
    const term = req.params.term;
    const terms = await Dictionary.find({
      term: new RegExp(term, "i"),
    });
    res.send({ terms });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTermById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }

    const term = await Dictionary.deleteOne({ _id: id });
    console.log(term);
    res.send(term);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTermById = async (req, res) => {
  try {
    const id = req.params.id;
    const { term } = req.body;
    const newTerm = await Dictionary.updateOne(
      { _id: id },
      {
        term,
        letter: term[0],
      }
    );
    res.send({ message: "Term updated succesfully", newTerm });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTermById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const term = await Dictionary.findOne({ _id: id });
    if (!term) {
      return res.status(400).send({ message: "Bunday termin mavjud emas" });
    }
    res.send({ term });
  } catch (error) {
    errorHandler(error, res);
  }
};
module.exports = {
  getTermById,
  addTerm,
  getTerms,
  getTermsByLetter,
  getTermsByName,
  deleteTermById,
  updateTermById,
};
