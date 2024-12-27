const {
  addTopic,
  getTopics,
  deleteTopicById,
  updateTopicById,
  getTopicById,
  getTopicsByTitleQuery,
} = require("../controllers/topic.controller");
const authorPolic = require("../police_middleware/author_police");

const router = require("express").Router();

router.post("/create", addTopic);

router.get("/all", getTopics);

router.get("/title", authorPolic, getTopicsByTitleQuery);

router.delete("/:id", authorPolic, deleteTopicById);

router.put("/:id", authorPolic, updateTopicById);

router.get("/:id", authorPolic, getTopicById);

module.exports = router;
