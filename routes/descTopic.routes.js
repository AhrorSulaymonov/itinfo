const {
  addDescTopic,
  getDescTopics,
  deleteDescTopicById,
  getDescTopicsByDesc_idQuery,
  getDescTopicsByTopic_idQuery,
  updateDescTopicById,
  getDescTopicById,
} = require("../controllers/descTopic.controller");
const admin_police = require("../police_middleware/admin_police");

const router = require("express").Router();

router.post("/create", admin_police, addDescTopic);

router.get("/all", admin_police, getDescTopics);

router.get("/Desc_id", admin_police, getDescTopicsByDesc_idQuery);

router.get("/Dict_id", admin_police, getDescTopicsByTopic_idQuery);

router.delete("/:id", admin_police, deleteDescTopicById);

router.put("/:id", admin_police, updateDescTopicById);

router.get("/:id", admin_police, getDescTopicById);

module.exports = router;
