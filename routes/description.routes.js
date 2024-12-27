const {
  addDescription,
  getDescriptions,
  deleteDescriptionById,
  getDescriptionsBycategory_idQuery,
  updateDescriptionById,
  getDescriptionById,
} = require("../controllers/description.controller");
const adminPolic = require("../police_middleware/admin_police");

const router = require("express").Router();

router.post("/create", adminPolic, addDescription);

router.get("/all", adminPolic, getDescriptions);

router.get("/category_id", adminPolic, getDescriptionsBycategory_idQuery);

router.delete("/:id", adminPolic, deleteDescriptionById);

router.put("/:id", adminPolic, updateDescriptionById);

router.get("/:id", adminPolic, getDescriptionById);

module.exports = router;
