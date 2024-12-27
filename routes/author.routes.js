const {
  addAuthor,
  getAuthors,
  deleteAuthorById,
  updateAuthorById,
  getAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  activateAuthor,
} = require("../controllers/author.controller");
const authorPolice = require("../police_middleware/author_police");
const authorSelfPolice = require("../police_middleware/author_self_police");

const router = require("express").Router();

router.post("/create", addAuthor);

router.get("/all", getAuthors);

router.get("/activate/:link", activateAuthor);

router.delete("/:id", authorPolice, authorSelfPolice, deleteAuthorById);

router.put("/:id", authorPolice, authorSelfPolice, updateAuthorById);

router.get("/:id", authorPolice, authorSelfPolice, getAuthorById);

router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);
module.exports = router;
