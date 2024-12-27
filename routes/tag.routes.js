const {
  addTag,
  getTags,
  deleteTagById,
  getTagsByCategory_idQuery,
  getTagsByTopic_idQuery,
  updateTagById,
  getTagById,
} = require("../controllers/tag.controller");
const adminPolic = require("../police_middleware/admin_police");

const router = require("express").Router();

router.post("/create", adminPolic, addTag);

router.get("/all", adminPolic, getTags);

router.get("/Category_id", adminPolic, getTagsByCategory_idQuery);

router.get("/Topic_id", adminPolic, getTagsByTopic_idQuery);

router.delete("/:id", adminPolic, deleteTagById);

router.put("/:id", adminPolic, updateTagById);

router.get("/:id", adminPolic, getTagById);

module.exports = router;
