const {
  addSynonym,
  getSynonymes,
  deleteSynonymById,
  getSynonymsByDesc_idQuery,
  getSynonymsByDict_idQuery,
  updateSynonymById,
  getSynonymById,
} = require("../controllers/synonym.controller");
const adminPolic = require("../police_middleware/admin_police");

const router = require("express").Router();

router.post("/create", adminPolic, addSynonym);

router.get("/all", adminPolic, getSynonymes);

router.get("/Desc_id", adminPolic, getSynonymsByDesc_idQuery);

router.get("/Dict_id", adminPolic, getSynonymsByDict_idQuery);

router.delete("/:id", adminPolic, deleteSynonymById);

router.put("/:id", adminPolic, updateSynonymById);

router.get("/:id", adminPolic, getSynonymById);

module.exports = router;
