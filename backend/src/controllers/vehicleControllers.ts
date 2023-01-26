import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../helpers/catchAsync";
import { endpointResponse } from "../helpers/succes";
import CreateHttpError from "http-errors";
import { VEHICLE } from "../database/models/vehicle.model";
import { vehicleInterface } from "../interfaces/interfaces";

export const vehicleList = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try{
        const vehicle = await VEHICLE.find().select({
            "documents":0,
            "_id":0
        })
        endpointResponse({res,code:vehicle.length===0?204:200,"message":"¡ Lista de vehiculos !","body":vehicle})
    } catch ( error:any ){
        const httpError = CreateHttpError(
            error.statusCode,
            `[Error retrieving vehicles list] - [vehicles - GET]: ${error.message}`
        )
        return next(httpError)
    }
})

export const vehicleDetail = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try{
        const vehicle = await VEHICLE.findOne({identifier:req.params.vehicleIdentifier})
        endpointResponse({res,"code":vehicle===null?204:200,"message":"¡Detalle de vehiculo!","body":vehicle})
    } catch ( error:any ){
        const httpError = CreateHttpError(
            error.statusCode,
            `[Error retrieving Vehicel detail] - [vehicle - ${req.params.vehicleIdentifier} - GET]: ${error.message}`
        )
        return next(httpError)
    }
})

export const vehicleSave = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try{
        const vehicle:vehicleInterface = {
            "vehicleDescription":req.body.vehicleDescription,
            "model":req.body.model,
            "identifier":req.body.identifier,
            "ownership":req.body.ownership,
            "personInCharge":req.body.personInCharge,
            "documents":req.body.documents || []
        }
        await VEHICLE.create(vehicle)
        endpointResponse({res,"code":201,"message":"¡ vehiculo creado !","body":vehicle})
    } catch ( error:any ){
        const httpError = CreateHttpError(
            error.statusCode,
            `[Error retrieving Vehicel detail] - [vehicle - ${req.params.vehicleIdentifier} - GET]: ${error.message}`
        )
        return next(httpError)
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