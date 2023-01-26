import { Request } from "express";
import { userAccount } from "../interfaces/interfaces";


export class userClass{
    public account:userAccount

    constructor(user:userAccount){
        this.account = user
    }

    public deleteHimSelf(req:Request){
        req.app.locals.users = req.app.locals.users.filter((user:userClass) => {
            return user.account.username !== this.account.username
        });
    }
}