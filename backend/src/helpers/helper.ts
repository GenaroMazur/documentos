import jwt from "jsonwebtoken"
const jwtSecret = process.env.SECRETJWT||""

export const resolveToken =async (token:string):Promise<any|null> => {
    try {
        const objectOfToken:any = jwt.verify(token,jwtSecret)
        return objectOfToken
    } catch (error) {
        return null
    }
}