const { mongo, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Author = require("../schemas/Author");
const { authorValidation } = require("../validations/author.validation");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const authorJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");

const uuid = require("uuid");
const mailService = require("../services/mail.service");
const logger = require("../services/logger.service");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    console.log(value);

    if (error) {
      return errorHandler(error, res);
    }
    const oldAuthor = await Author.findOne({
      author_email: value.author_email,
    });
    if (oldAuthor) {
      return res.status(400).send({ message: "This author already exists" });
    }

    const hashedPassword = bcrypt.hashSync(value.author_password, 7);

    const activation_link = uuid.v4();
    console.log("activation link", activation_link);

    const newAuthor = await Author.create({
      ...value,
      author_password: hashedPassword,
      activation_link,
    });

    await mailService.sendMailActivationCode(
      value.author_email,
      `${config.get("api_url")}/api/author/activate/${activation_link}`
    );
    res.send({
      message: "New author added",
      id: newAuthor._id,
      newAuthor,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { author_email, author_password } = req.body;
    const author = await Author.findOne({ author_email });
    if (!author) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const validPassowrd = bcrypt.compareSync(
      author_password,
      author.author_password
    );
    if (!validPassowrd) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }

    const payload = {
      id: author._id,
      email: author.author_email,
      author_is_active: author.author_is_active,
    };

    const tokens = authorJwt.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });

    // try {
    //   setTimeout(function () {
    //     const err = new Error("uncaughtExpectionError");
    //     throw err;
    //   }, 1000);
    // } catch (error) {
    //   console.log(error);
    // }
    // new Promise((_, reject) => {
    //   reject(new Error("unhandledRejection"));
    // });

    // try {
    //   setTimeout(function () {
    //     const err = new Error("unCaughException error");
    //     throw err;
    //   }, 1000);
    // } catch (error) {
    //   console.log(error);
    // }

    // new Promise((__, reject) => {
    //   reject(new Error("unhandledRejection example"));
    // });

    // const token = jwt.sign(payload, config.get("tokenKey"), {
    //   expiresIn: config.get("tokenTime"),
    // });
    //yozzzzzzzzzzzz

    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      author_id: author._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ message: "token topilmadi" });
    }
    const author = await Author.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!author) {
      return res.status(400).send({ message: "Bunday tokenli author yo'q" });
    }
    res.clearCookie("refreshToken");
    res.send({ refreshToken: author.refresh_token });
  } catch (error) {
    errorHandler(error, res);
  }
};
const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "token topilmadi" });
    }
    const [error, tokenFromCookie] = await to(
      authorJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(401).send({ error: error.message });
    }
    const author = await Author.findOne({ refresh_token: refreshToken });
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    const payload = {
      id: author._id,
      email: author.author_email,
      author_is_active: author.author_is_active,
    };

    const tokens = authorJwt.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });

    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    console.log(req);

    res.send({ authors });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthorsByNameQuery = async (req, res) => {
  try {
    const searchQuery = req.query;
    const authors = await Author.find({
      author_name: new RegExp(searchQuery.name, "i"),
    }).populate("parent_author_id", "-_id");
    res.send({ authors });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const author = await Author.deleteOne({ _id: id });
    console.log(author);
    res.send(author);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password,
      author_info,
      author_position,
      author_photo,
      is_expert,
      author_is_active,
    } = req.body;
    console.log(
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password,
      author_info,
      author_position,
      author_photo,
      is_expert,
      author_is_active
    );

    const newAuthor = await Author.updateOne(
      { _id: id },
      {
        $set: {
          author_first_name,
          author_last_name,
          author_nick_name,
          author_email,
          author_phone,
          author_password,
          author_info,
          author_position,
          author_photo,
          is_expert,
          author_is_active,
        },
      }
    );

    res.send({ message: "Author updated successfully", newAuthor });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await Author.findOne({ _id: id });
    if (!author) {
      return res.status(400).send({ message: "Bunday author mavjud emas" });
    }
    res.send({ author });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateAuthor = async (req, res) => {
  try {
    const link = req.params.link;
    const author = await Author.findOne({ activation_link: link });
    if (!author) {
      return res.status(400).send({ message: "Bunday avtor topilmadi" });
    }
    if (author.author_is_active) {
      return res.status(400).send({ message: "Avtor oldin faollashtirilgan" });
    }
    author.author_is_active = true;
    await author.save();
    res.send({
      message: "Avtor faollashtirildi",
      is_active: author.author_is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addAuthor,
  getAuthors,
  deleteAuthorById,
  updateAuthorById,
  getAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  activateAuthor,
};
