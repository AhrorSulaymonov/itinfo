const router = require("express").Router();
const { createViewPage } = require("../helpers/create_view_page");
const { errorHandler } = require("../helpers/error_handler");
const Dictionary = require("../schemas/Dictionary");

router.get("/", (req, res) => {
  res.render(createViewPage("index"), {
    title: "Asosiy sahifa",
    isHome: true,
  });
});

router.get("/dictionary", async (req, res) => {
  try {
    const dicts = JSON.parse(JSON.stringify(await Dictionary.find()));
    console.log(dicts);

    res.render(createViewPage("dictionary"), {
      title: "Lug'at sahifa",
      isDictionary: true,
      dicts,
    });
  } catch (err) {
    errorHandler(err, res);
  }
});

router.get("/topic", (req, res) => {
  res.render(createViewPage("topic"), {
    title: "Maqolalar sahifa",
    isTopic: true,
  });
});
router.get("/author", (req, res) => {
  res.render(createViewPage("author"), {
    title: "Yozuvchi sahifa",
    isAuthor: true,
  });
});

router.get("/login", (req, res) => {
  res.render(createViewPage("login"), {
    title: "Login sahifa",
    isLogin: true,
  });
});

router.get("/addAuthor", (req, res) => {
  res.render(createViewPage("addAuthor"), {
    title: "addAuthor sahifa",
    isAddAuthor: true,
  });
});

router.get("/loginAdmin", (req, res) => {
  res.render(createViewPage("loginAdmin"), {
    title: "loginAdmin sahifa",
    isLoginAdmin: true,
  });
});

router.get("/admin", (req, res) => {
  res.render(createViewPage("admin"), {
    title: "admin sahifa",
    isAdmin: true,
  });
});

module.exports = router;
