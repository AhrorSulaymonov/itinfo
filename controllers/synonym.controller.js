const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Synonym = require("../schemas/Synonym");
const { synonymValidation } = require("../validations/synonym.validation");

const addSynonym = async (req, res) => {
  try {
    const { error, value } = synonymValidation(req.body);
    console.log(value);
    if (error) {
      return errorHandler(error, res);
    }
    const { desc_id, dict_id } = req.body;
    const oldSynonym = await Synonym.findOne({ desc_id, dict_id });
    if (oldSynonym) {
      return res.status(400).send({ message: "This cynonym already exists" });
    }
    const newSynonym = await Synonym.create({
      desc_id,
      dict_id,
    });
    res.status(201).send({ message: "New cynonym added", newSynonym });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSynonymes = async (req, res) => {
  try {
    const synonymes = await Synonym.find()
      .populate("desc_id", "-_id")
      .populate("dict_id", "-_id");
    res.send({ synonymes });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSynonymById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const synonym = await Synonym.findOne({ _id: id })
      .populate("desc_id", "-_id")
      .populate("dict_id", "-_id");
    if (!synonym) {
      return res.status(400).send({ message: "Bunday synonym mavjud emas" });
    }
    res.send({ synonym });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSynonymsByDesc_idQuery = async (req, res) => {
  try {
    const desc_id = req.query.desc_id;
    const synonymes = await Synonym.find({ desc_id })
      .populate("desc_id", "-_id")
      .populate("dict_id", "-_id");
    res.send({ synonymes });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSynonymsByDict_idQuery = async (req, res) => {
  try {
    const dict_id = req.query.dict_id;
    const synonymes = await Synonym.find({ dict_id })
      .populate("desc_id", "-_id")
      .populate("dict_id", "-_id");
    res.send({ synonymes });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteSynonymById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const cynonym = await Synonym.deleteOne({ _id: id });
    console.log(cynonym);
    res.send(cynonym);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateSynonymById = async (req, res) => {
  try {
    const id = req.params.id;
    const { desc_id, dict_id } = req.body;
    const newSynonym = await Synonym.updateOne(
      { _id: id },
      {
        desc_id,
        dict_id,
      }
    );
    res.send({ message: "Synonym updated succesfully", newSynonym });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addSynonym,
  getSynonymes,
  deleteSynonymById,
  getSynonymsByDesc_idQuery,
  getSynonymsByDict_idQuery,
  updateSynonymById,
  getSynonymById,
};
