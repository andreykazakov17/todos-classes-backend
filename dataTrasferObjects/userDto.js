module.exports = class UserDto {
  email;
  id;
  isAuth;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isAuth = model.isAuth;
  }
};
