const {
  addUser,
  getUsers,
  deleteUserById,
  updateUserById,
  getUserById,
  loginUser,
  logoutUser,
  refreshUserToken,
  activateUser,
} = require("../controllers/user.controller");
const userPolice = require("../police_middleware/user_police");
const userSelfPolice = require("../police_middleware/user_self_police");

const router = require("express").Router();

router.post("/create", addUser);

router.get("/all", userPolice, getUsers);

router.get("/activate/:link", activateUser);

router.delete("/:id", userPolice, userSelfPolice, deleteUserById);

router.put("/:id", userPolice, userSelfPolice, updateUserById);

router.get("/:id", userPolice, userSelfPolice, getUserById);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshUserToken);
module.exports = router;
