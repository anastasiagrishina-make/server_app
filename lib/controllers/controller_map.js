import { toDoList } from "../databases/map.js"
import {getRandomInt} from "../utils/random-int.js";

//List
const listTasks_Map = async (req, res) => {
    res.status(200).json(Array.from(toDoList.values()))
};

const listAuthors_Map = async (req, res) => {
   //TODO
};

//Get
const getTask_Map = async (req, res) => {
    const {id} = req.params;
    const item = toDoList.get(Number(id));

    if (!item) {
        return res.status(400).json({"message": "Provided ID doesn't exist."})
    }

    res.status(200).json(item);
};

//Create
const createTask_Map = async (req, res) => {
    if (!req.body.author && !req.body.task) {
        return res.status(404).json({"message": "Input must contain author and task."})
    }

    const id = getRandomInt(1000);
    const item = {
        id,
        ...req.body
    }

    toDoList.set(id, item)
    res.status(200).json(item)
};

//Update
const updateTask_Map = async (req, res) => {
    const {id} = req.params;
    const {author, task} = req.body;

    if (!toDoList.has(Number(id))) {
        return res.status(400).json({"message": "Provided ID doesn't exist."})
    }
    if (!author || !task) {
        return res.status(404).json({"message": "Input must contain author and task."})
    }

    const item = {
        id: Number(id),
        ...req.body
    }

    toDoList.set(Number(id), item)

    res.status(200).json(item)
};

//Delete
const deleteTask_Map = async (req, res) => {
    const {id} = req.params;

    if (!toDoList.has(Number(id))) {
        return res.status(400).json({"message": "Provided ID doesn't exist."})
    }

    toDoList.delete(Number(id));
    res.status(200).json();
};

export {
    listTasks_Map,
    listAuthors_Map,
    getTask_Map,
    createTask_Map,
    updateTask_Map,
    deleteTask_Map
};