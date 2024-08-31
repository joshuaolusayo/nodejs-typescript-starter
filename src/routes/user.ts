import express, { Request, Response, NextFunction } from "express";
import userServiceInstance from "@/services/user";
import { AuthMiddleware } from "@/middlewares/auth";
// import { upload } from "@/utilities/storage/config";

const router = express.Router();
const authMiddleware = new AuthMiddleware();

router
  .get(
    "/",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.readRecordsByFilter(
        request,
        next
      );
      next();
    }
  )
  .get(
    "/me",
    authMiddleware.authenticate([{ model: "User" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.getCurrentUser(request, next);
      next();
    }
  )
  .get(
    "/:id/profile",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.readRecordById(request, next);
      next();
    }
  )
  .post(
    "/signup",
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.createUser(request, next);
      next();
    }
  )
  .post(
    "/verify-email",
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.verifyEmailOtp(request, next);
      next();
    }
  )
  .post(
    "/resend-email-verification",
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.requestEmailVerificationOTP(
        request,
        next
      );
      next();
    }
  )
  .post(
    "/initialize-reset-password",
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.initiateResetPassword(
        request,
        next
      );
      next();
    }
  )
  .post(
    "/reset-password",
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.resetPassword(request, next);
      next();
    }
  )
  .post("/login", async (request: Request, _: Response, next: NextFunction) => {
    request.payload = await userServiceInstance.loginUser(request, next);
    next();
  })
  .post(
    "/change-password",
    authMiddleware.authenticate([{ model: "User" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.changePassword(request, next);
      next();
    }
  )
  .put(
    "/update-profile",
    authMiddleware.authenticate([{ model: "User" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await userServiceInstance.updateUserRecord(
        request,
        next
      );
      next();
    }
  );
// .post(
//   "/test-sms",
//   // authMiddleware.authenticate([{ model: "User" }]),
//   async (request: Request, _: Response, next: NextFunction) => {
//     request.payload = await userServiceInstance.testSMS(request, next);
//     next();
//   }
// )
// .post(
//   "/test-email",
//   // authMiddleware.authenticate([{ model: "User" }]),
//   async (request: Request, _: Response, next: NextFunction) => {
//     request.payload = await userServiceInstance.testEmail(request, next);
//     next();
//   }
// )
// .put(
//   "/profile-picture",
//   authMiddleware.authenticate([{ model: "User" }]),
//   upload.single("profilePicture"),
//   async (request: Request, _: Response, next: NextFunction) => {
//     request.payload = await userServiceInstance.modifyProfilePicture(
//       request,
//       next
//     );
//     next();
//   }
// );

export default router;
