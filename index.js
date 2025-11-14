const express = require("express")
const app = express()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API')
})

app.post('/tasks', async (req, res) => {
    const { title } = req.body

    if(!title){
        return res.status(400).json({message : "title required"})
    }

    try{
        const newtask = await prisma.task.create({
            data: {
                title: title,
            },
        })
        res.status(201).json(newtask)
    }catch(error){
        console.log(error)
        console.log("Failed to create task")
            res.status(500).json({message: "internal server error"})
            res.json({message: "Failed to create task"})
    }
})


app.get('/tasks', async (req,res) => {
    try{
        const tasks = await prisma.task.findMany()
        res.status(200).json(tasks)
    }catch(error){
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }
})

app.put('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { title, complete } = req.body

  try {
    const existing = await prisma.task.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ message: "task not found" })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        complete: complete !== undefined ? complete : existing.complete
      },
    })

    res.status(200).json(updatedTask)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "internal server error" })
  }
})


app.delete('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id)

  try {
    const existing = await prisma.task.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ message: "task not found" })
    }

    await prisma.task.delete({ where: { id } })
    res.status(200).json({ message: "task deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "internal server error" })
  }
})


app.listen(3000, () => 
    console.log('running in http://localhost:3000')
)