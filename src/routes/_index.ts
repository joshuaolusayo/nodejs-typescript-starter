/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import express, { Router } from "express";
import userRoute from "./user";
import adminRoute from "./admin";
import fileRoute from "./api/file";
// import contactRoute from "./contact";

const router: Router = express.Router();

// handle routes here
router.use("/api/v1/users", userRoute);
router.use("/api/v1/admins", adminRoute);
// router.use("/api/v1/files", fileRoute);
// router.use("/api/v1/contacts", contactRoute);

export default router;
