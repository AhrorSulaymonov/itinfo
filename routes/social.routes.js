const {
  addSocial,
  getSocials,
  getSocialsByNameQuery,
  deleteSocialById,
  updateSocialById,
  getSocialById,
} = require("../controllers/social.controller");
const authorPolice = require("../police_middleware/author_police");

const router = require("express").Router();

router.post("/create", authorPolice, addSocial);

router.get("/all", authorPolice, getSocials);

router.get("/name", authorPolice, getSocialsByNameQuery);

router.delete("/:id", authorPolice, deleteSocialById);

router.put("/:id", authorPolice, updateSocialById);

router.get("/:id", authorPolice, getSocialById);

module.exports = router;
