const { userOpts } = require('./ObjectOpts');

const UserSchema = (handler) => ({
  schema: {
    response: {
      200: userOpts,
    },
  },
  handler,
});

module.exports = UserSchema;
