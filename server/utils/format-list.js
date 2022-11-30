export function formatList(toDoList) {
    result = []
    toDoList.forEach(toDo => {
        //result.push(`${toDo.author}, your ToDo for today: ${toDo.task}`)
        result.push(toDo)
    })
    return result
}