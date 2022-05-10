const ObjectOpts = require("./ObjectOpts");

const ArraySchema = (handler) => {
  return {
    schema: {
      response: {
        200: {
          type: "array",
          items: ObjectOpts.TodoOpts,
        },
      },
    },
    handler: handler,
  };
};

module.exports = ArraySchema;
