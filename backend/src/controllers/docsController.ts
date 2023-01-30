import { catchAsync } from "../helpers/catchAsync";
import { Request, Response, NextFunction } from "express"
import createHttpError from "http-errors";
import { VEHICLE } from "../database/models/vehicle.model";
import { endpointResponse } from "../helpers/succes";
import { docInterface } from "../interfaces/interfaces";
import { dateZoneString, dateNowTimestamp } from "../helpers/helper";

export const docsExpiredList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query: any = {
        "$lte": dateZoneString(dateNowTimestamp(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0],
        "$gte": dateZoneString(dateNowTimestamp() - 60 * 60 * 24 * 30, 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]
    }
    if (req.query.afterTo !== undefined) {
        query.$gte = req.query.afterTo
        req.query.beforeTo === undefined ? delete query.$lte : null
    }
    if (req.query.beforeTo !== undefined) {
        query.$lte = req.query.beforeTo
        req.query.afterTo === undefined ? delete query.$gte : null
    }
    try {
        let ArrayOfDocs: Array<docInterface> = []
        let documents: any = await VEHICLE.find({ "documents": { $elemMatch: { "expiredIn": query } } }).select({
            "documents": 1,
            "identifier": 1,
            "_id": 0
        })

        if (documents.length > 0) {
            ArrayOfDocs = documents.map((object: any) => {
                return object.documents.map((doc: any) => {
                    doc.identifier = object.identifier
                    return doc
                })
            })
                .reduce((response: any, docs: any) => response.concat(docs))
                .filter((doc: any) => {
                    doc.document = undefined
                    if (query.$gte !== undefined && query.$lte !== undefined) {
                        return doc.expiredIn >= query.$gte && doc.expiredIn <= query.$lte
                    } else if (query.$gte !== undefined && query.$lte === undefined) {
                        return doc.expiredIn >= query.$gte
                    } else if (query.$gte === undefined && query.$lte !== undefined) {
                        return doc.expiredIn <= query.$lte
                    }
                })
        }
        endpointResponse({ res, code: ArrayOfDocs.length === 0 ? 204 : 200, "message": "¡ Documentos expirados !", "body": ArrayOfDocs })
    } catch (error: any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving documents expired list] - [docsExpired - GET]: ${error.message}`
        )
        return next(httpError)
    }
})

export const docsToCar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const vehicleIdentifier = req.params.vehicleIdentifier

    try {
        const vehicle = await VEHICLE.findOne({ identifier: vehicleIdentifier }).select({ "documents": 1, "identifier": 1 })
        let docs: any = vehicle?.documents

        let message: string = `¡ documentos del vehiculo ${vehicleIdentifier} !`
        if (req.query.expired === "true") {
            message = `¡ documentos vencidos del vehiculo ${vehicleIdentifier} !`
            docs = docs.filter((doc: docInterface) => {
                return doc.expiredIn <= dateZoneString(dateNowTimestamp(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]
            })
        }
        docs.map((doc: any) => {
            doc.document = undefined
            return doc
        })
        endpointResponse({ res, code: docs.length === 0 ? 204 : 200, message, body: docs })
    } catch (error: any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving vehicle documents list] - [${vehicleIdentifier}/documents - GET]: ${error.message}`
        )
        return next(httpError)
    }
})

export const upDocument = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const vehicleIdentifier = req.params.vehicleIdentifier
    try {

        const document: docInterface = {
            "document": req.body.document,
            "documentType": req.body.documentType,
            "expiredIn": req.body.expiredIn,
            "description": req.body.description,
            "lastUpdated":dateZoneString(dateNowTimestamp(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]
        }

        await VEHICLE.findOneAndUpdate({ identifier: vehicleIdentifier }, { "$push": { "documents": document } })
        endpointResponse({ res, code: 201, message: "¡ Documento agregado al vehiculo !", body: document })
    } catch (error: any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving vehicle up document] - [${vehicleIdentifier}/documents - POST]: ${error.message}`
        )
        return next(httpError)
    }
})

export const docById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const vehicleIdentifier = req.params.vehicleIdentifier
    const documentId: string = req.params.documentId
    try {

        const doc = (await VEHICLE.findOne({"documents._id":documentId},{"documents.$":1}))?.documents[0]

        endpointResponse({ res, code: 200, message: "¡ Documento encontrado !", body: doc })
    } catch (error: any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving vehicle search a document] - [${vehicleIdentifier}/documents/${documentId} - PUT]: ${error.message}`
        )
        return next(httpError)
    }
})

export const updateDocById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const vehicleIdentifier = req.params.vehicleIdentifier
    const documentId: string = req.params.documentId
    try {

        const document: any = {
            "documents.$.document": req.body.document,
            "documents.$.documentType": req.body.documentType,
            "documents.$.expiredIn": req.body.expiredIn,
            "documents.$.description": req.body.description,
            "documents.$.lastUpdated":dateZoneString(dateNowTimestamp(), 'zu-ZA', 'America/Argentina/Cordoba').split(" ")[0]
        }

        await VEHICLE.findOneAndUpdate({"documents._id":documentId},document)
        endpointResponse({res, message:"documento actualizado"})
    } catch (error: any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving vehicle update document] - [${vehicleIdentifier}/documents/${documentId} - PUT]: ${error.message}`
        )
        return next(httpError)
    }
})

export const deleteADocumentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const vehicleIdentifier = req.params.vehicleIdentifier
    const documentId: string = req.params.documentId
    try{

        await VEHICLE.findOneAndUpdate({"identifier":vehicleIdentifier},{"$pull":{"documents":{"_id":documentId}}})
        endpointResponse({res,message:"Documento Eliminado"})
    } catch (error: any) {
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving vehicle delete a document] - [${vehicleIdentifier}/documents/${documentId} - DELETE]: ${error.message}`
        )
        return next(httpError)
    }
})

export const allDocs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
try{
    const vehicles = await VEHICLE.find().select({documents:1,identifier:1})

    let ArrayOfDocs = vehicles.map((object: any) => {
        return object.documents.map((doc: any) => {
            
            doc.identifier = object.identifier
            doc.document = undefined

            return doc
        }) 
    })
    
    ArrayOfDocs=ArrayOfDocs.reduce((response: any, docs: any) => response.concat(docs))
    endpointResponse({res, code:200, message:"List of all docs",body:ArrayOfDocs})
} catch (error: any) {
    console.log(error);
    
        const httpError = createHttpError(
            error.statusCode,
            `[Error retrieving list of All docs] - [/allDocs - GET]: ${error.message}`
        )
        return next(httpError)
    }
})