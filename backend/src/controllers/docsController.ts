import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../helpers/catchAsync";
import { endpointResponse } from "../helpers/succes";
import CreateHttpError from "http-errors";
import path from "path"
import fs from "fs"
const docUbication = path.join(__dirname,"./../../docs/")

export const docsList = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try{
        fs.readdir(docUbication,((err,files)=>{
            if(err!==null){
                console.log(err);
                throw new Error("Error al leer los archivos")
            }else{
                const docs = files
                endpointResponse({res,"code":200,"message":"¡ Lista de documentos !", "body":docs})
            }
        }))
    } catch ( error:any ){
        const httpError = CreateHttpError(
            error.statusCode,
            `[Error retrieving document list] - [documents - GET]: ${error.message}`
        )
        return next(httpError)
    }
})

export const docDetail = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try{
        const fileToSend = req.params.docName
        if(fs.existsSync(docUbication+fileToSend)){
            res.sendFile(docUbication+fileToSend)
        } else {
            endpointResponse({res,"code":200,"message":"¡ documento inexistente !"})
        }
    } catch ( error:any ){
        const httpError = CreateHttpError(
            error.statusCode,
            `[Error retrieving document list] - [documents - GET]: ${error.message}`
        )
        return next(httpError)
    }
})

export const docUp = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try{
        endpointResponse({res, "message":"subido"})
    } catch ( error ){

    }
})

export const docDelete = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try{

    } catch ( error ){

    }
})

export const docUpdate = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try{

    } catch ( error ){

    }
})