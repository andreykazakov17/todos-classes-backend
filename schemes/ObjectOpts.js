const TodoOpts = {
  type: "object",
  properties: {
    id: { type: "string" },
    text: { type: "string" },
    completed: { type: "boolean" },
  },
};

const userOpts = {
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
    isAuth: {
      type: "boolean",
    },
  },
};

module.exports = { TodoOpts, userOpts };
