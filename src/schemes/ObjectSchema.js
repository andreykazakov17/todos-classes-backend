const ObjectOpts = require('./ObjectOpts');

const ObjectSchema = (preHandler, handler) => ({
  schema: {
    response: {
      200: ObjectOpts.TodoOpts,
    },
  },
  preHandler,
  handler,
});

module.exports = ObjectSchema;
