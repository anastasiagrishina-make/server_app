const getRandomInt = require("./utils/random-int")
const formatList = require("./utils/format-list")

const express = require('express');
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
    res.status(200).json(formatList(toDoList))
})

//Get a specific by ID
app.get('/todo/:id', (req, res) => {
    const { id } = req.params;
    let item = toDoList.get(Number(id));

    if (typeof item !== 'undefined') {
        res.status(200).json(item);
    }
    else res.status(400).json({ "message": "Provided ID doesn't exist." })
})

//Create
app.post('/todo', (req, res) => {

    if (req.body.author && req.body.task) {
        let newId = getRandomInt(1000);
        req.body['id'] = newId
        toDoList.set(newId, req.body)
        res.status(200).json(req.body)
    }
    else res.status(404).json({ "message": "Input must contain author and task." })

})

//Update
app.put('/todo/:id', (req, res) => {
    const { id } = req.params;


    if (req.body.author && req.body.task && toDoList.has(Number(id))) {
        toDoList.delete(Number(id));

        req.body['id'] = Number(id);

        toDoList.set(Number(id), req.body)
        res.status(200).json(req.body)
    }
    else if (!req.body.author || !req.body.task) {
        res.status(404).json({ "message": "Input must contain author and task." })
    }
    else res.status(400).json({ "message": "Provided ID doesn't exist." })

})

//Delete
app.delete('/todo/:id', (req, res) => {
    const { id } = req.params;

    if (toDoList.has(Number(id))) {

        toDoList.delete(Number(id));
        res.status(200).json();
    }
    else res.status(400).json({ "message": "Provided ID doesn't exist." })
})
