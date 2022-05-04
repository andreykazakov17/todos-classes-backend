const TodoModel = require("../models/TodoModel");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, DELETE, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": 2592000,
  "Content-Type": "application/json",
  "Access-Control-Allow-Credentials": true,
};

const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    res.headers(headers);
    res.send(await TodoModel.findOne({ _id: id }));
  } catch (error) {
    res.code(500).send({ message: `Can't find todo with this id` });
  }
};

const getTodos = async (req, res) => {
  try {
    res.headers(headers);
    res.send(await TodoModel.find());
  } catch (error) {
    res.code(500).send({ message: "Server error" });
  }
};

const addTodo = async (req, reply) => {
  let newTodo = await new TodoModel({
    text: req.body,
    completed: false,
  });

  await newTodo.save();
  reply.headers(headers);
  reply.send(JSON.stringify(newTodo));
};

const toggleTodos = async (req, res) => {
  let todos = await TodoModel.find();

  if (todos.every((todo) => todo.completed)) {
    try {
      await TodoModel.updateMany({ completed: false });
      res.headers(headers);
      res.send(JSON.stringify(await TodoModel.find()));
    } catch (error) {
      res.code(500).send({ message: error });
    }
  } else if (
    todos.every((todo) => !todo.completed) ||
    todos.some((todo) => todo.completed)
  ) {
    try {
      await TodoModel.updateMany({ completed: true });
      res.headers(headers);
      res.send(JSON.stringify(await TodoModel.find()));
    } catch (error) {
      res.send({ message: error });
    }
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id: _id } = req.params;

    let updatedTodo = await TodoModel.findByIdAndUpdate(
      _id,
      { text: req.body.value },
      { new: true }
    );
    res.headers(headers);
    res.send(JSON.stringify(updatedTodo));
  } catch (error) {
    res.send({ message: error });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id: _id } = req.params;

    const deletedTodo = await TodoModel.findByIdAndDelete({ _id });
    const deletedTodoId = deletedTodo.id;
    res.headers(headers);
    res.send(JSON.stringify(deletedTodoId));
  } catch (error) {
    res.send({ message: error });
  }
};

const checkTodo = async (req, res) => {
  try {
    const { id: _id } = req.params;

    const foundTodo = await TodoModel.findById({ _id });
    let todo = await TodoModel.findByIdAndUpdate(
      _id,
      { completed: !foundTodo.completed },
      { new: true }
    );
    res.headers(headers);
    res.send(JSON.stringify(todo));
  } catch (error) {
    res.send({ message: error });
  }
};

const clearCompleted = async (req, res) => {
  try {
    await TodoModel.deleteMany({ _id: req.body });
    res.headers(headers);
    res.send(JSON.stringify(await TodoModel.find()));
  } catch (error) {
    res.send({ message: error });
  }
};

module.exports = {
  getTodo,
  getTodos,
  addTodo,
  toggleTodos,
  updateTodo,
  deleteTodo,
  checkTodo,
  clearCompleted,
};
