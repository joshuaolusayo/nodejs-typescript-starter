import express, { Request, Response, NextFunction } from "express";
import contactService from "@/services/contact";
import { AuthMiddleware } from "@/middlewares/auth";

const router = express.Router();
const authMiddleware = new AuthMiddleware();

router
  .get(
    "/",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await contactService.readRecordsByFilter(
        request,
        next
      );
      next();
    }
  )
  .get(
    "/:id",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await contactService.readRecordById(request, next);
      next();
    }
  )
  .post("/", async (request: Request, _: Response, next: NextFunction) => {
    request.payload = await contactService.createNew(request, next);
    next();
  })
  .put(
    "/:id",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await contactService.updateRecordById(request, next);
      next();
    }
  )
  .delete(
    "/:id",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await contactService.deleteRecordById(request, next);
      next();
    }
  );

export default router;
