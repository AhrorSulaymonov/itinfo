const { to } = require("../helpers/to_promise");
const adminJwt = require("../services/jwt_service");
module.exports = async function (req, res, next) {
  try {
    const id = req.params.id;
    if (id !== req.admin.id) {
      return res.status(403).send({ message: "Sizda bunday huquq yo'q" });
    }

    next();
  } catch (error) {
    return res
      .status(403)
      .send({ message: "admin self police" + error.message });
  }
};
