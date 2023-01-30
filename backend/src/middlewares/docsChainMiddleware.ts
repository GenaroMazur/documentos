import { body } from "express-validator";

export const docChain = [
    body("document")
        .notEmpty().withMessage("El campo 'document' no puede estar vacio").bail()
        // .isBase64().withMessage("El documento debe estar en formato 'base64'").bail()
        .isByteLength({"max":2*10**6}).withMessage("El documento no debe pesar mas de 2 MegaBytes"),
    body("documentType")
        .notEmpty().withMessage("El campo 'documentType' no puede estar vacio"),
    body("expiredIn")
        .notEmpty().withMessage("El campo 'expiredIn' no puede estar vacio").bail()
        .custom((value:string, {req})=>{
            try {
                const dateArray = value.split("-")
                if(dateArray.length !== 3) throw new Error("La fecha no coincide con el formato yyyy-mm-dd")
                if(dateArray[0].length !==4) throw new Error("La fecha no coincide con el formato yyyy-mm-dd")
                if(dateArray[1].length !==2) throw new Error("La fecha no coincide con el formato yyyy-mm-dd")
                if(dateArray[2].length !==2) throw new Error("La fecha no coincide con el formato yyyy-mm-dd")
                return true
            } catch (error:any) {
                throw new Error(error.message)
            }
        })
]