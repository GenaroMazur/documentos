import { catchAsync } from "../helpers/catchAsync";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { objectOfToken, userAccount } from "../interfaces/interfaces";
import { endpointResponse } from "../helpers/succes";
import { User } from "../database/models/User.model";

const jwtSecret = process.env.SECRETJWT||""
const saltBcrypt = parseInt(process.env.SALTBCRYPT||"0")
export const login = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
    try {
        
        const user:userAccount = req.app.locals.users.find((user:userAccount)=>user.username===req.body.username)
        const objectToToken:objectOfToken = {
            "username":user.username,
            "firstName":user.information?.firstName||"",
            "lastName":user.information?.lastName||"",
            "document":user.information?.document||0,
            "email":user.information?.email||"",
            "role":user.role || "USER",
            "cellphone":user.information?.cellphone
        }
        let token
        if(user.username==="administrador"){
            token = jwt.sign(objectToToken,jwtSecret,{"expiresIn":"14d"})
        } else {
            token = jwt.sign(objectToToken,jwtSecret,{"expiresIn":"1d"})
        }
        return endpointResponse({res, "code":200,"message":"¡ Inicio de sesion exitoso !", "body":{token:"Bearer "+token}})
    } catch (error:any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving login] - [login - POST]: ${error.message}`
        )
        return next(httpError)
    }
})
export const register = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const user:userAccount = {
            "username":req.body.username,
            "password":bcrypt.hashSync(req.body.password,saltBcrypt),
            "role":req.body.role,
            "information":{
                "document":req.body.document,
                "firstName":req.body.firstName,
                "lastName":req.body.lastName,
                "email":req.body.email,
                "cellphone":req.body.cellphone
            }
        }
        await User.create(user)
        return endpointResponse({res,"message":"¡ Registrado con exito !", code:201})
    } catch (error:any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving register] - [register - POST]: ${error.message}`
        )
        return next(httpError)
    }
})