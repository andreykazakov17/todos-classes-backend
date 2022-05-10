const ObjectOpts = require("./ObjectOpts");

const UserSchema = (handler) => {
  return {
    schema: {
      response: {
        200: ObjectOpts.userOpts,
      },
    },
    handler: handler,
  };
};

module.exports = UserSchema;
