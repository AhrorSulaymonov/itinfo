const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const User = require("../schemas/User");
const { userValidation } = require("../validations/user.validation");
const bcrypt = require("bcrypt");
const userJwt = require("../services/jwt_service");
const config = require("config");
const { to } = require("../helpers/to_promise");
const mailService = require("../services/mail.service");
const uuid = require("uuid");

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    console.log(value);

    if (error) {
      return errorHandler(error, res);
    }
    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      user_is_active,
    } = req.body;
    const oldUser = await User.findOne({
      user_email: value.user_email,
    });
    if (oldUser) {
      return res.status(400).send({ message: "This user already exists" });
    }

    const hashedPassword = bcrypt.hashSync(value.user_password, 7);

    const activation_link = uuid.v4();
    console.log(activation_link);

    const newUser = await User.create({
      ...value,
      user_password: hashedPassword,
      activation_link,
    });

    await mailService.sendMailActivationCode(
      value.user_email,
      `${config.get("api_url")}/api/user/activate/${activation_link}`
    );
    res.send({
      message: "New user added",
      id: newUser._id,
      newUser,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(user_password, user.user_password);
    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const payload = {
      id: user._id,
      email: user.user_email,
      user_is_active: user.user_is_active,
    };

    const tokens = userJwt.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });

    res.status(200).send({ message: "Tizimga xush kelibsiz", ...tokens });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ message: "token topilmadi" });
    }
    const user = await User.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!user) {
      return res.status(400).send({ message: "Bunday tokenli user yo'q" });
    }
    res.clearCookie("refreshToken");
    res.send({ refreshToken: user.refresh_token });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "token topilmadi" });
    }
    const { error, tokenFromCookie } = await to(
      userJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(401).send({ error: error.message });
    }
    const user = await User.findOne({ refresh_token: refreshToken });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const payload = {
      id: user._id,
      email: user.user_email,
      user_is_active: user.user_is_active,
    };

    const tokens = userJwt.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });

    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      accesstoken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send({ users });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUsersByNameQuery = async (req, res) => {
  try {
    const searchQuery = req.query;
    const users = await User.find({
      user_name: new RegExp(searchQuery.name, "i"),
    }).populate("parent_user_id", "-_id");
    res.send({ users });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const user = await User.deleteOne({ _id: id });
    console.log(user);
    res.send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      user_is_active,
    } = req.body;
    console.log(
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      user_is_active
    );

    const newUser = await User.updateOne(
      { _id: id },
      {
        $set: {
          user_name,
          user_email,
          user_password,
          user_info,
          user_photo,
          user_is_active,
        },
      }
    );

    res.send({ message: "User updated successfully", newUser });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).send({ message: "Bunday user mavjud emas" });
    }
    res.send({ user });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateUser = async (req, res) => {
  try {
    const link = req.params.link;
    const user = await User.findOne({ activation_link: link });
    if (!user) {
      return res.status(400).send({ message: "Bunday user topilmadi" });
    }
    if (user.user_is_active) {
      return res.status(400).send({ message: "User oldin faollashtirilgan" });
    }
    user.user_is_active = true;
    await user.save();
    res.send({
      message: "User faollashtirildi",
      is_active: user.user_is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addUser,
  getUsers,
  deleteUserById,
  updateUserById,
  getUserById,
  loginUser,
  logoutUser,
  refreshUserToken,
  activateUser,
};
