import { resolveToken } from "../helpers/helper";
import { catchAsync } from "../helpers/catchAsync";
import { NextFunction, Request, Response } from "express";
import { endpointResponse } from "../helpers/succes";
import { objectOfToken } from "../interfaces/interfaces";

const roleValidationMiddleware = (only:"USER"|"DRIVER"|"ADMIN"="USER")=>{
    return catchAsync(async (req:Request, res:Response, next:NextFunction) => {

    if(req.headers["authorization"] === undefined) return endpointResponse({res,"code":402,"message":"¡ No cuenta con un token !"})
    const token = req.headers["authorization"].split(" ")

    if(token[0].toLowerCase() !== "bearer") return endpointResponse({res, "code":402,"message":"¡ Token no valido !"})
    const resolvedToken:objectOfToken|null = await resolveToken(token[1])

    if(resolvedToken === null) return endpointResponse({res, "code":402,"message":"¡ Token no valido !"})
    
    switch (only){
        case "ADMIN":
            if(resolvedToken.role==="USER" || resolvedToken.role==="DRIVER") return endpointResponse({res, "code":401,"message":"¡ No autorizado !"})
            break;
        case "DRIVER":
            if(resolvedToken.role==="USER") return endpointResponse({res, "code":401,"message":"¡ No autorizado !"})
            break;
    }
    return next()
})
}
export default roleValidationMiddleware