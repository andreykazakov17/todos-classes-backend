const bcrypt = require("bcrypt");

const {
  generateTokens,
  saveToken,
  validateAccessToken,
  findToken,
  validateRefreshToken,
  removeToken,
} = require("../service/tokenService");

const UserModel = require("../models/UserModel");
const UserDto = require("../dataTrasferObjects/userDto");
const TokenModel = require("../models/TokenModel");

const registration = async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      return res
        .code(400)
        .send({ message: "User with current id already exists in database" });
    }
    const hashPassword = bcrypt.hashSync(password, 3);
    const user = await UserModel.create({ email, password: hashPassword });

    const userDto = new UserDto(user);
    const tokens = generateTokens({ ...userDto });

    res.setCookie("refreshToken", tokens.refreshToken, {
      domain: "localhost",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    await saveToken(userDto.id, tokens.refreshToken);
    res.send({ ...tokens, user: userDto });
  } catch (e) {
    console.log(e);
    res.code(400).send({ message: "Registration error" });
  }
};

const login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.code(400).send({ message: `User not found` });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.code(400).send({ message: "Incorrect password" });
    }

    console.log(user);
    console.log("user.id", user.id);

    const userDto = new UserDto(user);

    const tokens = generateTokens({ email: user.email, id: user.id });
    await saveToken(userDto.id, tokens.refreshToken);

    res.setCookie("refreshToken", tokens.refreshToken, {
      domain: "localhost",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.send({ ...tokens, user: userDto });
  } catch (e) {
    console.log(e);
    res.code(400).send({ message: "Login error" });
  }
};

const logout = async (req, res) => {
  try {
    const user = await UserModel.findOne({ isAuth: true });
    console.log("user", user);
    const unauthentificatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      {
        isAuth: false,
      },
      { new: true }
    );
    res.send(unauthentificatedUser);
  } catch (e) {}
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = validateRefreshToken(refreshToken);
    const tokenFromDb = await findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      res.code(500).send({ message: "Refresh token error" });
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = generateTokens({ ...userDto });

    await saveToken(userDto.id, tokens.refreshToken);

    res.setCookie("refreshToken", tokens.refreshToken, {
      domain: "localhost",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.send({ ...tokens, user: userDto });
  } catch (e) {}
};

module.exports = { registration, login, logout, refresh };
