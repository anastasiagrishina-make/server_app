import express from "express";
import Router from "../routes/routes.js";


export const toDoList = new Map([
    [1, {
        id: 1,
        author: {
            id: 2,
            firstname: "Ian",
            lastname: "Freeman",
            createdAt: "2022-12-07T17:25:35.530Z",
            modifiedAt: "2022-12-07T17:25:35.584Z"
        },
        name: "CLEAN",
        description: "clean kitchen",
        createdAt: "2022-12-07T17:25:35.584Z",
        modifiedAt: "2022-12-07T17:25:35.584Z"
    }],
    [2, {
        id: 2,
        author: {
            id: 3,
            firstname: "John",
            lastname: "Klop",
            createdAt: "2022-12-07T19:00:00.000Z",
            modifiedAt: "2022-12-07T19:00:00.000Z"
        },
        name: "DO",
        description: "make kitchen dirty",
        createdAt: "2022-12-07T19:00:00.000Z",
        modifiedAt: "2022-12-07T19:00:00.000Z"
    }]
]);

export default function connectMap(PORT) {

    const app = express();

    app.use(Router);

    app.listen(PORT, () => {
        console.log(`Map. Example app listening on port ${PORT}`)
    });
}

