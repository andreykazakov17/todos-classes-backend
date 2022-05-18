const { userOpts } = require("./ObjectOpts");

const UserSchema = (handler) => {
  return {
    schema: {
      response: {
        200: userOpts,
      },
    },
    handler: handler,
  };
};

module.exports = UserSchema;
