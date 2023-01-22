import express from "express";
import Router from "../routes/routes.js";


export const toDoList = new Map([
    [1, {id: 1, author: "Ian", task: "clean kitchen"}],
    [2, {id: 2, author: "Jon", task: "make kitchen dirty"}]
]);

export default function connectMap(PORT) {

    const app = express();

    app.use(Router);

    app.listen(PORT, () => {
        console.log(`Map. Example app listening on port ${PORT}`)
    });
}

