// import express, { Request, Response, NextFunction } from "express";
// import contact_service from "@/services/contact";
// import { AuthMiddleware } from "@/middlewares/auth";

// const router = express.Router();
// const authMiddleware = new AuthMiddleware();

// router
//   .get(
//     "/",
//     authMiddleware.authenticate([{ model: "Admin" }]),
//     async (request: Request, _: Response, next: NextFunction) => {
//       request.payload = await contact_service.readRecordsByFilter(
//         request,
//         next
//       );
//       next();
//     }
//   )
//   .get(
//     "/:id",
//     authMiddleware.authenticate([{ model: "Admin" }]),
//     async (request: Request, _: Response, next: NextFunction) => {
//       request.payload = await contact_service.readRecordById(request, next);
//       next();
//     }
//   )
//   .post("/", async (request: Request, _: Response, next: NextFunction) => {
//     request.payload = await contact_service.create_new_contact(request, next);
//     next();
//   })
//   .put(
//     "/:id",
//     authMiddleware.authenticate([{ model: "Admin" }]),
//     async (request: Request, _: Response, next: NextFunction) => {
//       request.payload = await contact_service.updateRecordById(
//         request,
//         next
//       );
//       next();
//     }
//   )
//   .delete(
//     "/:id",
//     authMiddleware.authenticate([{ model: "Admin" }]),
//     async (request: Request, _: Response, next: NextFunction) => {
//       request.payload = await contact_service.deleteRecordById(
//         request,
//         next
//       );
//       next();
//     }
//   );

// export default router;
