import { Router } from "express";
import { UserController } from "@src/controllers/User";
import { authorization } from "@src/middlewares/authorization";
import { authentication } from "@src/middlewares/authentication";

const UserRouter = Router();

UserRouter.post("/save/admin", authentication, authorization, UserController.createAdminUser);
UserRouter.post("/save/regular", authentication, UserController.createRegularUser);
UserRouter.get("/list", authentication, authorization, UserController.readAllUsers);
UserRouter.get("/list/:id", authentication, authorization, UserController.readUser);
UserRouter.put("/update/:id", authentication, authorization, UserController.updateUser);
UserRouter.patch("/change-password", authentication, authorization, UserController.changeSelfPassword);
UserRouter.patch("/update-role/:id", authentication, authorization, UserController.updateUserRole);
UserRouter.delete("/remove/:id", authentication, authorization, UserController.removeUser);

export { UserRouter };