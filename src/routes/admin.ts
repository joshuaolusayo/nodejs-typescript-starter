import express, { Request, Response, NextFunction } from "express";
import adminServiceInstance from "@/services/admin";
import { AuthMiddleware } from "@/middlewares/auth";

const router = express.Router();
const authMiddleware = new AuthMiddleware();

router
  .get(
    "/",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await adminServiceInstance.readRecordsByFilter(
        request,
        next
      );
      next();
    }
  )
  .get(
    "/me",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await adminServiceInstance.fetchCurrentAdmin(
        request,
        next
      );
      next();
    }
  )
  .post(
    "/signup",
    authMiddleware.authenticate([{ model: "Admin", roles: ["superadmin"] }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await adminServiceInstance.createAdmin(request, next);
      next();
    }
  )
  .post("/login", async (request: Request, _: Response, next: NextFunction) => {
    request.payload = await adminServiceInstance.login(request, next);
    next();
  })
  .post(
    "/initialize-reset-password",
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await adminServiceInstance.initiateResetPassword(
        request,
        next
      );
      next();
    }
  )
  .post(
    "/reset-password",
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await adminServiceInstance.resetPassword(request, next);
      next();
    }
  )
  .post(
    "/change-password",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await adminServiceInstance.changePassword(
        request,
        next
      );
      next();
    }
  )
  .put(
    "/update-profile",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await adminServiceInstance.updateUserRecord(
        request,
        next
      );
      next();
    }
  );

export default router;
