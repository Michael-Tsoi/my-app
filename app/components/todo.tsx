// src/components/todo.tsx

"use client"
import { FormEvent, useEffect, useState } from "react"
import { remult } from "remult"
import { Task } from "../shared/Task"
import { TasksController } from "../shared/TasksController"


const taskRepo = remult.repo(Task)

export default function Todo() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {

    taskRepo.find({
        limit: 20,
        orderBy: { createdAt: "asc" },
        //where: { completed: true  }
    }).then(setTasks)

    // return taskRepo.liveQuery({
    //   limit: 20,
    //   orderBy: { createdAt: "asc" }
    // })
    // .subscribe(info => setTasks(info.applyChanges))
    
  }, [])


  const addTask = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const newTask = 
      await taskRepo.insert({ title: newTaskTitle })

    // ^ this no longer needs to be a variable as we are not using it to set the state.
       setTasks([...tasks, newTask])   // <-- this line is no longer needed if using liveQuery      

      setNewTaskTitle('')
    } catch (error) {
      alert( ( error as { message: string} ).message )
    }
  }

  const setAllCompleted = async (completed: boolean) => {

    // for (const task of await taskRepo.find()) {
    //   await taskRepo.save({ ...task, completed })
    // }

    await TasksController.setAllCompleted(completed)

  }  

  return (
    <div>
      <h1>Todos</h1>
      <main>
      {taskRepo.metadata.apiInsertAllowed() && (
        <form onSubmit={addTask}>
          <input
            value={newTaskTitle}
            placeholder="What needs to be done?"
            onChange={e => setNewTaskTitle(e.target.value)}
          />
          <button>Add</button>  
        </form>
      )}
        { tasks.map((task) => {

          const setTask = (value: Task) =>
          setTasks(tasks => tasks.map(t => (t === task ? value : t)))

          const setCompleted = async (completed: boolean) =>
          setTask(await taskRepo.save({ ...task, completed })) // <-- this line is no longer needed if using liveQuery  
          // await taskRepo.save({ ...task, completed })

          const setTitle = ( title: string ) => setTask({...task, title})

          const saveTask = async () => {
            try {
              setTask(await taskRepo.save(task))  // <-- this line is no longer needed if using liveQuery  
              // await taskRepo.save(task) // <- replace with this line
            } catch (error) {
              alert((error as { message: string}).message)
            }
          }

          const deleteTask = async () => {
            try {
              await taskRepo.delete(task)
              setTasks(tasks.filter(t => t !== task)) // <-- this line is no longer needed if using liveQuery  
            } catch (error) {
              alert((error as { message: string }).message)
            }
          }          

          return (
            <div key={task.id}>
              <input 
                type="checkbox" 
                checked={task.completed}
                onChange={e => setCompleted(e.target.checked)}
              />
              <input value={task.title} onChange={e => setTitle(e.target.value)} />
              <button onClick={saveTask}>Save</button>
              {' '}
              {taskRepo.metadata.apiDeleteAllowed(task) && (
              <button onClick={deleteTask}>Delete</button>
              )}
            </div>
          )
        }) }
      <div>
        <button onClick={() => setAllCompleted(true)}>Set All Completed</button>
        {" "}
        <button onClick={() => setAllCompleted(false)}>Set All Uncompleted</button>
      </div>        
      </main>
    </div>
  )
}