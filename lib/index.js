import express from "express";
import {listTasks, listAuthors, createTask, updateTask, getTask, deleteTask} from "./controllers/controller.js";

const app = express();

//Routes
app.get("/tasks", listTasks);
app.get("/authors", listAuthors);

app.get("/tasks/:id", getTask);

app.post("/add_task", createTask);

app.put("/tasks/:id", updateTask);

app.delete("/tasks/:id", deleteTask);

export default app;