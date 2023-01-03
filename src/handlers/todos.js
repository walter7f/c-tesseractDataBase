import express, { request, response } from "express";
import { getDBHandler } from "../db/index.js";

 const ToDosRequestHandler= express.Router();
// crea algo nuevo
 ToDosRequestHandler.post("/to-dos", async (request, response)=>{
    try {
        const{title, description, isDone: is_done}= request.body;
        const dbHandler = await getDBHandler();

        const newTodo = await dbHandler.run(`
            INSERT INTO todos (title, description, is_done)
            VALUES(
                '${title}',
                '${description}',
                '${is_done? 1:0}'
            )
        `);

        await dbHandler.close();
        
        response.send({newTodo:{title,description,is_done, ...newTodo}});

    } catch (error) {
        response.status(500).send({
        error: `Something went wrong when trying to create a new to do`,
        errorInfo: error.message,
    });
    }
 });
//Muentra los datos  alamcenados
 ToDosRequestHandler.get("/to-dos", async (request, response)=>{
    try {
        const dbHandler = await getDBHandler();

        const todos = await dbHandler.all("SELECT * FROM todos");
        await dbHandler.close();

        if (!todos || !todos.length){
            return response.status(404).send({message:"To Dos not found"});
        }

        response.send({todos});
    } catch (error) {
        response.status(500).send({
        error: `Something went wrong when trying to get todos`,
        errorInfo: error.message,
    });
    }
 });

 //Borrar datos 

 ToDosRequestHandler.delete("/to-dos/:id", async (request, response)=>{
    try {
        const todoId = request.params.id;
        const dbHandler = await getDBHandler();

        const deletedTodo= await dbHandler.run(
            "DELETE FROM todos WHERE id = ?", //Metodo de escape, para evitar  ciber ataques
            todoId
        );

        await dbHandler.close();
        response.send({todoRemoved: {...deletedTodo}});
        
    } catch (error) {
        response.status(500).send({
        error: `Something went wrong when deleted a todos`,
        errorInfo: error.message,
    });
    }
 });

 // Actualiza datos
 ToDosRequestHandler.patch("/to-dos/:id", async (request, response)=>{
    try {
        const todoId = request.params.id;
        const{title, description, is_done}= request.body;
        const dbHandler = await getDBHandler();

        const todoToUpdate =  await dbHandler.get(
            `SELECT * FROM  todos WHERE  id = ?`,
            todoId
        );
        let isDone = is_done ? 1 : 0

        await dbHandler.run(`
        UPDATE todos SET title = ?, description = ?, is_done = ?
        WHERE id = ?
        `,
         title || todoToUpdate.title,
         description || todoToUpdate.description,
         isDone,
         todoId
         );

        await dbHandler.close();
        response.send({todoUpdate: {... todoToUpdate, title, description,is_done}});
        
        } catch (error) {
        response.status(500).send({
        error: `Something went wrong when trying to upadate a todos`,
        errorInfo: error.message,
     });
    }
 });



export default (ToDosRequestHandler);
 




/* codigo de prueva de fronted
    todos.map((todos)=>{
      if (todos.id === id) {
         patchTodo(id, {...todos, isDone: !todos.isComplete}).then(()=>{
         getTodos().then((remoteTodos)=>{
          setTodos(remoteTodos);
          });
       });
      }
    });
  }
*/