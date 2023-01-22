import { toDoList } from "../databases/map.js"
import {getRandomInt} from "../utils/random-int.js";

//List
const listTasks_Map = async (req, res) => {
    res.status(200).json(Array.from(toDoList.values()))
};

const listAuthors_Map = async (req, res) => {
    const tasks = Array.from(toDoList.values())
    const authors = tasks.map(item => item.author)

    res.status(200).json(authors)
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
    if (!req.body.author.firstname && !req.body.author.lastname && !req.body.name) {
        return res.status(404).json({"message": "Input must contain author{firstname and lastname} and task."})
    }

    const id = getRandomInt(1000);
    const idAuthor = getRandomInt(100000);
    const item = {
        id,
        ...req.body,
        createdAt: new Date(),
        modifiedAt: new Date()
    }

    item.author["id"] = idAuthor;
    item.author["createdAt"] = new Date();
    item.author["modifiedAt"] = new Date();

    toDoList.set(id, item)
    res.status(200).json(item)
};

//Update
const updateTask_Map = async (req, res) => {
    const {id} = req.params;
    const {author, name, description} = req.body;
    let found = toDoList.get(Number(id))

    if (!found) {
        return res.status(400).json({"message": "Provided ID doesn't exist."})
    }
    if (!author && !name && !description) {
        return res.status(404).json({"message": "Input must contain author, name or description."})
    }

    const item = {
        id: Number(id),
        author: {
            id: found.author.id,
            firstname: author.firstname || found.author.firstname,
            lastname: author.lastname || found.author.lastname,
            createdAt: found.author.createdAt,
            modifiedAt: new Date()
        },
        name: name || found.name,
        description: description || found.description,
        createdAt: found.createdAt,
        modifiedAt: new Date()
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