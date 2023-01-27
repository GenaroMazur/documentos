import { catchAsync } from "../helpers/catchAsync";
import { Request, Response, NextFunction } from "express"
import createHttpError from "http-errors";
import { VEHICLE } from "../database/models/vehicle.model";
import { endpointResponse } from "../helpers/succes";
import { docInterface } from "../interfaces/interfaces";
import { dateZoneString, dateNowTimestamp } from "../helpers/helper";

export const docsExpiredList = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    let query:any = {"$lte":dateZoneString(dateNowTimestamp(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]}
    
    if(req.query.afterTo!==undefined){
        query = {"$gte":req.query.afterTo}
    }
    try {
        let ArrayOfDocs:Array<docInterface>=[]
        let documents:any = await VEHICLE.find({"documents.expiredIn":query}).select({
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
            }).reduce((response:any,docs:any)=>response.concat(docs))
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