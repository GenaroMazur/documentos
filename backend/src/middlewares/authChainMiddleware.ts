import { body } from "express-validator"
import bcrypt from "bcrypt"
import { User } from "../database/models/User.model"
import { userAccount } from "../interfaces/interfaces"
const letters = "abcdefghijklmnñopqrstuvwxyz"
const nums = "0123456789"
export const loginChainValidator = [
    body("username")
        .notEmpty().withMessage("El campo 'username' no puede estar vacio").bail()
        .custom(async(value,{req})=>{
            const user:userAccount|null = await User.findOne({username:value})
            if(user!==null){                
                req.app.locals.users.push(user)
            } else {
                throw new Error("No existe este usuario")
            }
            return true
        }),
    body("password")
        .notEmpty().withMessage("El campo 'password' no puede estar vacio").bail()
        .custom(async(value,{req})=>{
            if(req.body.username === undefined) return true
            if(req.app.locals.users === undefined) return true
            const user:userAccount|undefined = req.app.locals.users.find((user:userAccount)=>user.username===req.body.username)
            if(user === undefined) return true
            if(!bcrypt.compareSync(value, user.password)){
                throw new Error("Contraseña incorrecta")
            }
            return true
        })
]

export const registerChainValidator = [
    body("username")
        .notEmpty().withMessage("El campo 'username' no puede estar vacio").bail()
        .isLength({min:4, max:16}).withMessage("El nombre de usuario debe ser mañor de 4 y menor de 16 caracteres").bail()
        .custom(async(value, {req})=>{
            const userInDb = await User.findOne({username:value}) 
            if(userInDb!==null) throw new Error("Ya existe un usuario con ese nombre")
            return true
        }),
    body("password")
        .notEmpty().withMessage("El campo 'password' no puede estar vacio").bail()
        .isLength({min:8}).withMessage("La constraseña no debe ser menor de 8 digitos").bail()
        .custom((value:string, {req})=>{
            let passwordRequires = {
                min:false,
                mayus:false,
                nums:false
            }
            if(letters.split("").some(letter=>value.includes(letter))) passwordRequires.min=true
            if(letters.toUpperCase().split("").some(letter=>value.includes(letter))) passwordRequires.mayus=true
            if(nums.split("").some(num=>value.includes(num))) passwordRequires.nums=true

            if(!passwordRequires.min) throw new Error ("La contraseña debe contener letras minusculas")
            if(!passwordRequires.mayus) throw new Error ("La contraseña debe contener letras mayusculas")
            if(!passwordRequires.nums) throw new Error ("La contraseña debe contener numeros")

            return true
        }),
    body("document")
        .notEmpty().withMessage("El campo 'document' no puede estar vacio").bail()
        .isInt({"min":999999}).withMessage("El campo 'document' debe ser un numero valido").bail(),
    body("firstName")
        .notEmpty().withMessage("El campo 'firstName' no puede estar vacio").bail(),
    body("lastName")
        .notEmpty().withMessage("El campo 'lastName' no puede estar vacio"),
    body("email")
        .isEmail().withMessage("El campo 'email' debe ser un correo valido"),
    body("role")
        .notEmpty().withMessage("El campo 'role' no debe estar vacio").bail()
        .isString().withMessage("El campo de rol debe ser un string").bail()
        .custom((value,{req})=>{
            if(value!=="USER" && value!=="ADMIN" && value!=="DRIVER") throw new Error("El campo rol solo puede tener 3 valores posibles : 'USER','ADMIN','DRIVER'")
            return true
        })
]