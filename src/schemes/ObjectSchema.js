const ObjectOpts = require("./ObjectOpts");

const ObjectSchema = (handler) => {
  return {
    schema: {
      response: {
        200: ObjectOpts.TodoOpts,
      },
    },
    handler: handler,
  };
};

module.exports = ObjectSchema;
