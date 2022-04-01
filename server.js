const http = require('http');
const { getReqData } = require("./utils");

const PORT = 5001;

let todos = [
    {
        id: 1,
        text: 'Todo1',
        completed: false
    },
    {
        id: 2,
        text: 'Todo2',
        completed: false
    },{
        id: 3,
        text: 'Todo3',
        completed: false
    }
];

class Controller {

    async getTodos() {
        return new Promise((resolve, _) => resolve(todos));
    }

    async getTodo(id) {
        return new Promise((resolve, reject) => {
            // get the todo
            let todo = todos.find((todo) => todo.id === parseInt(id));
            if (todo) {
                resolve(todo);
            } else {
                reject(`Todo with id ${id} not found `);
            }
        });
    }

    async createTodo(body) {
        return new Promise((resolve, _) => {
            let newTodo = {
                id: new Date().getTime(),
                ...body,
                completed: false
            };
            resolve(newTodo);
        });
    }

    async deleteTodo(id) {
        return new Promise((resolve, reject) => {
            todos = todos.filter((todo) => todo.id !== parseInt(id));
            resolve(`Todo deleted successfully`);
        });
    }

    async updateTodoComplete(id) {
        return new Promise((resolve, reject) => {
            todos = todos.map((todo) => todo.id === parseInt(id) ? { ...todo, completed: !todo.completed } : todo);
            resolve(todos);
        });
    }

    async updateTodoInput(body) {
        return new Promise((resolve, reject) => {
            const parsedBody = JSON.parse(body);
            const { id, text } = parsedBody;
            todos = todos.map((todo) => todo.id === parseInt(id) ? { ...todo, text: text } : todo);
            resolve(todos);
        });
    }

    async clearCompleted() {
        return new Promise((resolve) => {
            todos = todos.filter((todo) => !todo.completed);
            resolve(todos);
        });
    }

    async checkAllTodos() {
        return new Promise((resolve) => {
            todos = todos.map((todo) => {
                return {...todo, completed: true}
            });
            resolve(todos);
        });
    }

    async uncheckAllTodos() {
        return new Promise((resolve) => {
            todos = todos.map((todo) => {
                return {...todo, completed: false}
            });
            resolve(todos);
        });
    }
}

const server = http.createServer(async(req, res) => {

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE, PATCH',
        'Access-Control-Max-Age': 2592000,
        'Content-Type': 'application/json'
    };

    // get all todos
    if (req.url === "/todos" && req.method === "GET") {

        const allTodos = await new Controller().getTodos();
        res.writeHead(200, headers);
        res.end(JSON.stringify(allTodos));

    } else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "GET") {
        try {

            const id = req.url.split("/")[2];
            const todo = await new Controller().getTodo(id);
            res.writeHead(200, headers);
            res.end(JSON.stringify(todo));

        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    } else if (req.url === "/todos" && req.method === "POST") {
        
        let todo_data = await getReqData(req);
        let todo = await new Controller().createTodo(JSON.parse(todo_data));
        todos = [...todos, todo];
        res.writeHead(200, headers);
        res.end(JSON.stringify(todo));

    } else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "POST") {

        try {
            const id = req.url.split("/")[2];
            let todo_data = await getReqData(req);

            let updatedTodos = await new Controller().updateTodoInput(todo_data);
            res.writeHead(200, headers);
            res.end(JSON.stringify(updatedTodos));

        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }


    } else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "DELETE") {
        try {
            const id = req.url.split("/")[2];

            let result = await new Controller().deleteTodo(id);
            res.writeHead(200, headers);
            res.end(JSON.stringify({ result }));
        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
        // DELETE ALL TODOS
    } else if (req.url === "/todos" && req.method === "DELETE") {

        try {

            let result = await new Controller().clearCompleted();
            res.writeHead(200, headers);
            res.end(JSON.stringify(result));
        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
        
    } else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PATCH") {
        try {
            const id = req.url.split("/")[2];

            let updatedTodos = await new Controller().updateTodoComplete(id);
            res.writeHead(200, headers);
            res.end(JSON.stringify(updatedTodos));

        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
        /// PATCH FOR TEXT UPDATING
    } else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "PATCH") {
        try {
            const id = req.url.split("/")[2];

            const updateText = (id) => {
                return new Promise((resolve, reject) => {
                    todos = todos.map((todo) => todo.id === id ? { ...todo, text: textInput.value } : todo);
                    resolve(todos);
                });
            }

            let updatedTodos = await updateText(id);
            res.writeHead(200, headers);
            res.end(JSON.stringify(updatedTodos));
        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    } else if (req.url === "/todos" && req.method === "PATCH") {

        if (todos.every((todo) => todo.completed)) {
            try {
                let result = await new Controller().uncheckAllTodos();
                res.writeHead(200, headers);
                res.end(JSON.stringify(result));
    
            } catch (error) {
    
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: error }));
            }
        } else if (todos.every((todo) => !todo.completed) || todos.some((todo) => todo.completed)) {
            try {
                let result = await new Controller().checkAllTodos();
                res.writeHead(200, headers);
                res.end(JSON.stringify(result));
    
            } catch (error) {
    
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: error }));
            }
        }
        
    } else if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

module.exports = todos;