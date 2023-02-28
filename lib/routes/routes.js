import express from "express";
import 'dotenv/config';
import {
    listTasks_Mongo,
    listAuthors_Mongo,
    getTask_Mongo,
    createTask_Mongo,
    updateTask_Mongo,
    deleteTask_Mongo
} from "../controllers/controller_mongodb.js"
import {
    listTasks_Map,
    listAuthors_Map,
    getTask_Map,
    createTask_Map,
    updateTask_Map,
    deleteTask_Map
} from "../controllers/controller_map.js"
import {
    listTasks_Postgres,
    listAuthors_Postgres,
    getTask_Postgres,
    createTask_Postgres,
    updateTask_Postgres,
    deleteTask_Postgres
} from "../controllers/controller_postgres.js";

const databaseType = process.env.DB;

//Logic
const selectDB = {
    mongodb: {
        listTasks: listTasks_Mongo,
        listAuthors: listAuthors_Mongo,
        getTask: getTask_Mongo,
        createTask: createTask_Mongo,
        updateTask: updateTask_Mongo,
        deleteTask: deleteTask_Mongo
    },
    map: {
        listTasks: listTasks_Map,
        listAuthors: listAuthors_Map,
        getTask: getTask_Map,
        createTask: createTask_Map,
        updateTask: updateTask_Map,
        deleteTask: deleteTask_Map
    },
    postgres: {
        listTasks: listTasks_Postgres,
        listAuthors: listAuthors_Postgres,
        getTask: getTask_Postgres,
        createTask: createTask_Postgres,
        updateTask: updateTask_Postgres,
        deleteTask: deleteTask_Postgres
    }
}

//Routing
const app = express();
app.use(express.json())

app.get("/tasks", selectDB[databaseType].listTasks);

app.get("/authors", selectDB[databaseType].listAuthors);

app.get("/tasks/:id", selectDB[databaseType].getTask);

app.post("/tasks", selectDB[databaseType].createTask);

app.put("/tasks/:id", selectDB[databaseType].updateTask);

app.delete("/tasks/:id", selectDB[databaseType].deleteTask);

export default app;