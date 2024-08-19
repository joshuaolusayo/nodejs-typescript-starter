import express, { Request, Response, NextFunction } from "express";
import admin_service from "@/services/admin";
import { AuthMiddleware } from "@/middlewares/auth";
import { upload } from "@/utilities/storage/config";
import file_service from "@/services/file";
import multer from "multer";

const router = express.Router();
const authMiddleware = new AuthMiddleware();

const storage = multer.memoryStorage();
const upload_file = multer({ storage: storage });

router
  .post(
    "/",
    authMiddleware.authenticate([{ model: "Admin" }]),
    upload.single("file"),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await file_service.upload_single_file(request, next);
      next();
    }
  )
  .post(
    "/create-container",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await file_service.create_azure_container(
        request,
        next
      );
      next();
    }
  )
  .post(
    "/upload",
    authMiddleware.authenticate([{ model: "Admin" }]),
    upload_file.array("file"),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await file_service.upload_files_to_azure(request, next);
      next();
    }
  )
  // .post(
  //   "/multiple",
  //   upload.array("files"),
  //   async (request: Request, _: Response, next: NextFunction) => {
  //     request.payload = await file_service.upload_single_file(request, next);
  //     next();
  //   }
  // )
  .get(
    "/list",
    authMiddleware.authenticate([{ model: "Admin", roles: ["admin"] }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await file_service.get_files(request, next);
      next();
    }
  )
  .get(
    "/retrieve/:filename",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await file_service.retrieve_file(request, next);
      next();
    }
  )
  .get(
    "/retrieve-files",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await file_service.retrieve_files_from_azure(
        request,
        next
      );
      next();
    }
  )
  .delete(
    "/remove/:filename",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await file_service.delete_file(request, next);
      next();
    }
  )
  .delete(
    "/remove-file",
    authMiddleware.authenticate([{ model: "Admin" }]),
    async (request: Request, _: Response, next: NextFunction) => {
      request.payload = await file_service.delete_file_from_azure(
        request,
        next
      );
      next();
    }
  );

export default router;
