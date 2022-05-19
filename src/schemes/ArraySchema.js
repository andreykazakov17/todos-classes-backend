const ObjectOpts = require('./ObjectOpts');

const ArraySchema = (preHandler, handler) => ({
  schema: {
    response: {
      200: {
        type: 'array',
        items: ObjectOpts.TodoOpts,
      },
    },
  },
  preHandler,
  handler,
});

module.exports = ArraySchema;
