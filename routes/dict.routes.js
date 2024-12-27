const {
  addTerm,
  getTerms,
  getTermsByLetter,
  getTermsByName,
  deleteTermById,
  updateTermById,
  getTermById,
} = require("../controllers/dict.controller");
const admin_police = require("../police_middleware/admin_police");

const router = require("express").Router();

router.post("/create", admin_police, addTerm);

router.get("/all", getTerms);
router.get("/letter", admin_police, getTermsByLetter);

router.get("/:id", admin_police, getTermById);

router.delete("/:id", admin_police, deleteTermById);

router.put("/:id", admin_police, updateTermById);

router.get("/term/:term", admin_police, getTermsByName);

module.exports = router;
