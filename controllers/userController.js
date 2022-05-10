// const UserService = require("../service/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TokenService = require("../service/tokenService");
const UserModel = require("../models/UserModel");
const UserDto = require("../dataTrasferObjects/userDto");

class userController {
  async registration(req, res) {
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
      const tokens = TokenService.generateTokens({ ...userDto });

      res.setCookie("refreshToken", tokens.refreshToken, {
        domain: "localhost",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      await TokenService.saveToken(userDto.id, tokens.refreshToken);
      res.send({ ...tokens, user: userDto });
    } catch (e) {
      console.log(e);
      res.code(400).send({ message: "Registration error" });
    }
  }

  async login(req, res) {
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

      const authentificatedUser = await UserModel.findByIdAndUpdate(
        user.id,
        {
          isAuth: true,
        },
        { new: true }
      );
      const userDto = new UserDto(authentificatedUser);
      console.log(userDto);
      const tokens = TokenService.generateTokens({ ...userDto });
      await TokenService.saveToken(userDto.id, tokens.refreshToken);

      res.setCookie("refreshToken", tokens.refreshToken, {
        domain: "localhost",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      console.log(res.headers);
      res.send({ ...tokens, user: userDto });
    } catch (e) {
      console.log(e);
      res.code(400).send({ message: "Login error" });
    }
  }

  async logout(req, res) {
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
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const userData = TokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await TokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
        res.code(500).send({ message: "Refresh token error" });
      }
      const user = await UserModel.findById(userData.id);
      const userDto = new UserDto(user);
      const tokens = TokenService.generateTokens({ ...userDto });

      await TokenService.saveToken(userDto.id, tokens.refreshToken);

      res.setCookie("refreshToken", tokens.refreshToken, {
        domain: "localhost",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.send({ ...tokens, user: userDto });
    } catch (e) {}
  }
}

module.exports = new userController();
