const ObjectOpts = require("./ObjectOpts");

const ObjectSchema = (handler) => {
  return {
    schema: {
      response: {
        200: ObjectOpts,
      },
    },
    handler: handler,
  };
};

module.exports = ObjectSchema;
