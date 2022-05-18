const TodoModel = require("../models/TodoModel");
const UserModel = require("../models/UserModel");

const headers = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, DELETE, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": 2592000,
  "Content-Type": "application/json",
  "Access-Control-Allow-Credentials": true,
};

const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findOne({ _id: id });
    res.headers(headers);
    res.send(todo);
  } catch (error) {
    res.code(500).send({ message: "Can't find todo with this id" });
  }
};

const getTodos = async (req, res) => {
  try {
    const user = await req.user;
    if (!user) {
      res.code(500).send({ message: "Bad request" });
      return;
    }
    const todosArr = await TodoModel.find({ user: user.id });
    res.headers(headers);
    res.send(todosArr);
  } catch (error) {
    res.code(500).send({ message: "Can't get todos" });
  }
};

const addTodo = async (req, reply) => {
  try {
    const userData = await req.user;
    const user = await UserModel.findOne({ _id: userData.id });
    let newTodo = await new TodoModel({
      text: req.body,
      completed: false,
      user: user._id,
    });

    await newTodo.save();
    reply.headers(headers);
    reply.send(JSON.stringify(newTodo));
  } catch (e) {
    res.code(500).send({ message: "Can't create todo" });
  }
};

const toggleTodos = async (req, res) => {
  const user = await req.user;
  let todos = await TodoModel.find({ user: user.id });

  if (todos.every((todo) => todo.completed)) {
    try {
      await TodoModel.updateMany({ user: user.id }, { completed: false });
      res.headers(headers);
      res.send(JSON.stringify(await TodoModel.find({ user: user.id })));
    } catch (error) {
      res.code(500).send({ message: "Can't update many todos" });
    }
  } else if (
    todos.every((todo) => !todo.completed) ||
    todos.some((todo) => todo.completed)
  ) {
    try {
      await TodoModel.updateMany({ user: user.id }, { completed: true });
      res.headers(headers);
      res.send(JSON.stringify(await TodoModel.find({ user: user.id })));
    } catch (error) {
      res.code(500).send({ message: "Can't update many todos" });
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
    res.code(500).send({ message: "Can't update todo text" });
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
    res.code(500).send({ message: "Can't delete todo" });
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
    res.code(500).send({ message: "Can't check todo" });
  }
};

const clearCompleted = async (req, res) => {
  try {
    const user = await req.user;
    await TodoModel.deleteMany({ _id: req.body });
    res.headers(headers);
    res.send(JSON.stringify(await TodoModel.find({ user: user.id })));
  } catch (error) {
    res.code(500).send({ message: "Can't clear completed todos" });
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
