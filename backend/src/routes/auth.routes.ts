import { Router } from "express";
import * as auth from "./../controllers/authController"
import { loginChainValidator, registerChainValidator } from "../middlewares/authChainMiddleware";
import validationHandler from "./../middlewares/validationHandlerMiddleware"
import roleValidation from "../middlewares/roleValidationMiddleware";

const router = Router()

router.post("/login",loginChainValidator, validationHandler, auth.login)
router.post("/register",roleValidation("ADMIN") , registerChainValidator, validationHandler, auth.register)

export default router