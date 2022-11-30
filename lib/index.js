import { getRandomInt } from "./utils/random-int.js";

import express from 'express';
const PORT = process.env.PORT || 3030;

const app = express();
const toDoList = new Map([
    [1, { id: 1, author: "Ian", task: "clean kitchen" }],
    [2, { id: 2, author: "Jon", task: "make kitchen dirty" }]
]);

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

//Get all
app.get('/todo', (req, res) => {
    res.status(200).json(Array.from(toDoList.values()))
})

//Get a specific by ID
app.get('/todo/:id', (req, res) => {
    const { id } = req.params;
    const item = toDoList.get(Number(id));

    if (!item) {
        return res.status(400).json({ "message": "Provided ID doesn't exist." })
    }

    res.status(200).json(item);
})

//Create
app.post('/todo', (req, res) => {

    if (!req.body.author && !req.body.task) {
        return res.status(404).json({ "message": "Input must contain author and task." })
    }


    const id = getRandomInt(1000);
    const item = {
        id,
        ...req.body
    }

    toDoList.set(id, item)
    res.status(200).json(item)
})

//Update
app.put('/todo/:id', (req, res) => {
    const { id } = req.params;
    const { author, task } = req.body;

    if (!toDoList.has(Number(id))) {
        return res.status(400).json({ "message": "Provided ID doesn't exist." })
    }
    if (!author || !task) {
        return res.status(404).json({ "message": "Input must contain author and task." })
    }

    const item = {
        id: Number(id),
        ...req.body
    }

    toDoList.set(Number(id), item)

    res.status(200).json(item)


})

//Delete
app.delete('/todo/:id', (req, res) => {
    const { id } = req.params;

    if (!toDoList.has(Number(id))) {
        return res.status(400).json({ "message": "Provided ID doesn't exist." })
    }

    toDoList.delete(Number(id));
    res.status(200).json();
})
