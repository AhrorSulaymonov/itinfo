const { to } = require("../helpers/to_promise");
const Admin = require("../schemas/Admin");
const adminJwt = require("../services/jwt_service");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res
        .status(403)
        .send({ message: "Admin ro'yxatdan o'tmagan (token topilmadi)" });
    }

    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      return res
        .status(403)
        .send({ message: "Admin ro'yxatdan o'tmagan (token topilmadi)" });
    }

    const [error, decodedToken] = await to(adminJwt.verifyaccessToken(token));

    if (error) {
      console.log(error);
      return res.status(403).send({ message: error.message });
    }
    console.log("decoded token", decodedToken);
    req.admin = decodedToken;
    const admin_is_creator = await decodedToken.admin_is_creator;
    if (!admin_is_creator) {
      return res.status(403).send({ message: "Admin creator emas" });
    }
    next();
  } catch (error) {
    return res.status(403).send({ message: error.message });
  }
};
