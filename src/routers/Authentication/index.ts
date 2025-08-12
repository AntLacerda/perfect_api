import { Router } from "express";
import { AuthController } from "../../controllers/Authentication";

const AuthRouter = Router();

AuthRouter.post("/signup", AuthController.signUp);
AuthRouter.post("/login", AuthController.login);

export { AuthRouter };