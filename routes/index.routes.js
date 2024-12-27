const router = require("express").Router();

const dictRoute = require("./dict.routes");
const categoryRoute = require("./category.routes");
const descriptionRoute = require("./description.routes");
const synonymRoute = require("./synonym.routes");
const authorRoute = require("./author.routes");
const socialRoute = require("./social.routes");
const authorSocialRoute = require("./authorSocial.routes");
const topicRoute = require("./topic.routes");
const descTopicRoute = require("./descTopic.routes");
const tagRoute = require("./tag.routes");
const adminRoute = require("./admin.routes");
const userRoute = require("./user.routes");

router.use("/dict", dictRoute);
router.use("/category", categoryRoute);
router.use("/description", descriptionRoute);
router.use("/synonym", synonymRoute);
router.use("/author", authorRoute);
router.use("/social", socialRoute);
router.use("/authorSocial", authorSocialRoute);
router.use("/topic", topicRoute);
router.use("/descTopic", descTopicRoute);
router.use("/tag", tagRoute);
router.use("/admin", adminRoute);
router.use("/user", userRoute);

module.exports = router;
