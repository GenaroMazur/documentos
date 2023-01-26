import morgan from "morgan";
import { SERVER } from "./server";
import { endpointResponse } from "./helpers/succes";
import indexRouter from "./routes/index.routes"

const server = SERVER.instance

server.init()
server.start()
.then((err)=>{
    if(err)throw new Error("error al iniciar servidor") && console.log(err)
    
    server.app.use(morgan("dev"))
    server.app.use(indexRouter)

    server.app.use((req, res, next) => {
        return endpointResponse({res,status:false,code:404,message:"endpoint no disponible o inexistente"})
    })
})
.catch(()=>{
    console.log("____________________________________________________");
})