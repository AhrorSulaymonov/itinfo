const {
  addAuthorSocial,
  getAuthorSocials,
  deleteAuthorSocialById,
  updateAuthorSocialById,
  getAuthorSocialById,
} = require("../controllers/authorSocial.controller");
const admin_police = require("../police_middleware/admin_police");
const authorPolice = require("../police_middleware/author_police");

const router = require("express").Router();

router.post("/create", authorPolice, addAuthorSocial);

router.get("/all", admin_police, getAuthorSocials);

router.delete("/:id", authorPolice, deleteAuthorSocialById);

router.put("/:id", authorPolice, updateAuthorSocialById);

router.get("/:id", getAuthorSocialById);

module.exports = router;
