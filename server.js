const http = require('http');
const { getReqData, getReqArr} = require("./utils");

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

let idsArray = [];

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
                text: body,
                completed: false
            };
            resolve(newTodo);
        });
    }

    async deleteTodo(id) {
        return new Promise((resolve, reject) => {
            const deletedTodo = todos.find((todo) => todo.id === parseInt(id));
            todos = todos.filter((todo) => todo.id !== parseInt(id));
            resolve(deletedTodo.id);
            if (!deletedTodo) {
                reject(`No todo with id ${id} found`);
            }
            // else, return a success message
            resolve(`Todo deleted successfully`);
        });
    }

    async updateTodoComplete(id) {
        return new Promise((resolve, reject) => {
            todos = todos.map((todo) => todo.id === parseInt(id) ? { ...todo, completed: !todo.completed } : todo);
            resolve(todos);
        });
    }

    async updateTodoInput(id, body) {
        return new Promise((resolve, reject) => {
            const parsedBody = JSON.parse(body);
            todos = todos.map((todo) => todo.id === parseInt(id) ? { ...todo, text: parsedBody } : todo);
            resolve(todos);
        });
    }

    // OLD DELETE ALL
    async clearCompleted(idsArray) {
        return new Promise((resolve) => {
            todos = todos.filter((todo) => !idsArray.includes(todo.id));
            resolve(todos);
        });
    }

    async checkAllTodos(valuesArr) {
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': 2592000,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true
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

        // POST REQUEST FOR DELETING
    } else if (req.url === "/todos/clearAll" && req.method === "POST") {
        
        let str = await getReqData(req);

        let numArr = str.split(',').map((num) => +num);
        let result = await new Controller().clearCompleted(numArr);
        res.writeHead(200, headers);
        res.end(JSON.stringify(result));

    } else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "POST") {

        try {
            const id = req.url.split("/")[2];
            let todoBody = await getReqData(req);

            
            let updatedTodos = await new Controller().updateTodoInput(id, todoBody);
            res.writeHead(200, headers);
            res.end(JSON.stringify(updatedTodos));

        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }


    } else if (req.url.match(/\/todos\/([0-9]+)/) && req.method === "DELETE") {
        try {
            const id = req.url.split("/")[2];

            const result = await new Controller().deleteTodo(id);
            res.writeHead(200, headers);
            res.end(JSON.stringify(result));
        } catch (error) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
        // DELETE ALL TODOS
    } else if (req.url === "/todos" && req.method === "DELETE") {

        try {
            const id = req.url.split("/")[2];

            let result = await new Controller().clearCompleted(id);
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

        // TOGGLE / UNTOGGLE ALL
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