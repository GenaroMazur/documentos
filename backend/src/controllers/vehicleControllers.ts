import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../helpers/catchAsync";
import { endpointResponse } from "../helpers/succes";
import CreateHttpError from "http-errors";

export const docsList = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try{

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