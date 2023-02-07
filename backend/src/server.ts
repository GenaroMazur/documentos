import express from "express"
import {Server} from "http"
import {mongoosedb} from "./database/mongoose"
import cors from "cors"

require("dotenv").config()

export class SERVER {
    
    private http:Server | undefined
    public app:express.Application
    private static _instance: SERVER

    public static get instance() { return this._instance || (this._instance = new this()) }

    constructor() {
        this.app = express()
        this.app.locals.users=[]
    }

    public init(): SERVER { return new SERVER() }

    public async start():Promise<void|unknown> {
        try {

            const port = process.env.PORT
            const urlDb = process.env.URLDB
            const saltBcrypt = process.env.SALTBCRYPT
            const jwtSecret = process.env.SECRETJWT
            const sessionSecret = process.env.SESSIONSECRET
            if (port === undefined || urlDb === undefined || saltBcrypt === undefined || jwtSecret===undefined || sessionSecret ===undefined) throw new Error("-------------- Faltan variables de entorno --------------")

            this.http = this.app.listen(port, () => {
                console.log(`=============== Servidor en \x1b[32mlinea\x1b[0m Puerto ${port} ===============`);
            })
            mongoosedb(urlDb)
            
            this.app.use(express.json({limit:"30mb"}))
            this.app.use(express.urlencoded({ limit:"30mb",extended: true }))
            this.app.use(cors())

        } catch (error) {
            return error
        }
    }

    public close():void{
        this.http?.close()
    }
}