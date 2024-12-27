const {
  addCategory,
  getCategories,
  deleteCategoryById,
  getCategorysByNameQuery,
  updateCategoryById,
  getCategoryById,
} = require("../controllers/category.controller");
const adminPolice = require("../police_middleware/admin_police");

const router = require("express").Router();

router.post("/create", adminPolice, addCategory);

router.get("/all", adminPolice, getCategories);

router.delete("/:id", adminPolice, deleteCategoryById);

router.put("/:id", adminPolice, updateCategoryById);

router.get("/name", adminPolice, getCategorysByNameQuery);

router.get("/:id", adminPolice, getCategoryById);

module.exports = router;
