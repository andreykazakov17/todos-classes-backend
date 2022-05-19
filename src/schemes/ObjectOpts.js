const TodoOpts = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    text: { type: 'string' },
    completed: { type: 'boolean' },
    user: { type: 'string' },
  },
};

const userOpts = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    id: {
      type: 'string',
    },
  },
};

module.exports = { TodoOpts, userOpts };
