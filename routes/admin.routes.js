const {
  addAdmin,
  getAdmins,
  deleteAdminById,
  updateAdminById,
  getAdminById,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} = require("../controllers/admin.controller");
const adminPolice = require("../police_middleware/admin_police");
const adminSelfPolice = require("../police_middleware/admin_self_police");
const creatorPolice = require("../police_middleware/creator_police");
const router = require("express").Router();

router.post("/create", creatorPolice, addAdmin);

router.get("/all", getAdmins);

router.delete("/:id", adminPolice, adminSelfPolice, deleteAdminById);

router.put("/:id", adminPolice, adminSelfPolice, updateAdminById);

router.get("/:id", adminPolice, adminSelfPolice, getAdminById);

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdminToken);
module.exports = router;
