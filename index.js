const express = require("express")
const app = express()

let tasks = []

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API')
})

app.post('/tasks', (req, res) => {
    const { title } = req.body

    if(!title){
        res.status(400).json({message : "title required"})
    }

    const newtask = {
        id: Date.now(),
        title,
        complete: false
    }

    tasks.push(newtask)

    res.status(201).json(newtask)

 })

app.get('/tasks', (req,res) => {
    res.json(tasks)
})

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id)
    const {title, complete} = req.body

    const task = tasks.find(t => t.id === id)

    if(!task){
        res.status(404).json({message: "task doesn't exist"})
    }

    if(title !== undefined){task.title = title}
    if(complete !== undefined){task.complete = complete}

    res.status(200).json({message: "success update the task"})

})

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id)
    const exist = tasks.some(t => t.id === id)

    if(!exist){
        res.status(404).json({message: "task doesn't exist"})
    }

    tasks = tasks.filter(t => t.id !== id)

    res.status(200).json({message: "task deleted"})
    
})

app.listen(3000, () => 
    console.log('running in http://localhost:3000')
)