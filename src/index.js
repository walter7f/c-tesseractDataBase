import cors from "cors";
import  express  from "express";    // se intalaron las dependencias de nodemon y express para la API
import {initDB} from "./db/index.js";
import  ToDosRequestHandler  from "./handlers/todos.js";


const Api = express();   // API Rest


Api.use(cors());// adminte las request de todos los servidores y no las restringe

Api.use(express.json());
Api.use(express.urlencoded({extended:false}));
// tambien se puede usar pero es preferible ponerlo de primero
Api.use("/api/v1", ToDosRequestHandler); //coneta con to-dos en todos.js
//Fetch API para conect api con fronted conecta clientes
//Axios es la mas recomendada (vamos a utilizarlo)

Api.listen(3000, ()=>{
        console.log("API is running :)\n");
        initDB().then(() => {
            console.log("DB is ready :)");
        });
});


// los cors dan acceso para interacturar no estan habilitados no permite 
//interactuar con el backend, restringe el acceso.
