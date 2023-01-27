import { catchAsync } from "../helpers/catchAsync";
import { Request, Response, NextFunction } from "express"
import createHttpError from "http-errors";
import { VEHICLE } from "../database/models/vehicle.model";
import { endpointResponse } from "../helpers/succes";
import { docInterface } from "../interfaces/interfaces";
import { dateZoneString, dateNowTimestamp } from "../helpers/helper";

export const docsExpiredList = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    let query:any = {
        "$lte":dateZoneString(dateNowTimestamp(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0],
        "$gte":dateZoneString(dateNowTimestamp()-60*60*24*30, 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]
    }
    if(req.query.afterTo!==undefined){
        query.$gte=req.query.afterTo
        req.query.beforeTo===undefined?delete query.$lte:null
    }
    if(req.query.beforeTo!==undefined){
        query.$lte=req.query.beforeTo
        req.query.afterTo===undefined?delete query.$gte:null
    }
    try {
        let ArrayOfDocs:Array<docInterface>=[]
        let documents:any = await VEHICLE.find({"documents":{$elemMatch:{"expiredIn":query}}}).select({
            "documents":1,
            "identifier":1,
            "_id":0
        })
        
        if(documents.length>0){
            ArrayOfDocs = documents.map((object:any)=>{
                return object.documents.map((doc:any)=>{
                    doc.identifier=object.identifier
                    return doc
                })
            })
            .reduce((response:any,docs:any)=>response.concat(docs))
            .filter((doc:any)=>{
                if(query.$gte!==undefined && query.$lte!==undefined){
                    return doc.expiredIn>=query.$gte && doc.expiredIn<=query.$lte
                } else if(query.$gte!==undefined && query.$lte===undefined){
                    return doc.expiredIn>=query.$gte
                } else if(query.$gte===undefined && query.$lte!==undefined){
                    return doc.expiredIn<=query.$lte
                }
            })
        }
        endpointResponse({res,code:ArrayOfDocs.length===0?204:200, "message":"¡ Documentos expirados !","body":ArrayOfDocs})
    } catch (error:any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving documents expired list] - [docsExpired - GET]: ${error.message}`
        )
        return next(httpError)
    }
})

export const docsToCar = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const vehicleIdentifier = req.params.vehicleIdentifier
    
    try {
        const vehicle = await VEHICLE.findOne({identifier:vehicleIdentifier}).select({"documents":1,"identifier":1})
        let docs:any = vehicle?.documents

        let message:string=`¡ documentos del vehiculo ${vehicleIdentifier} !`
        if(req.query.expired==="true"){
            message=`¡ documentos vencidos del vehiculo ${vehicleIdentifier} !`
            docs = docs.filter((doc:docInterface)=>{
                return doc.expiredIn<=dateZoneString(dateNowTimestamp(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]
            })
        }
        endpointResponse({res,code:docs.length===0?204:200,message, body:docs})
    } catch (error:any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving vehicle documents list] - [${vehicleIdentifier}/documents - GET]: ${error.message}`
        )
        return next(httpError)
    }
})