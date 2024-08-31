/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Environment from "@/config/env";
import expressConfig from "./express-config";
import serverConfig from "./src";
import connectDatabase from "@/config/database";
import routeHandler from "@/routes/_index";
import HTTP from "@/middlewares/handler";
import logger from "@/logs";
import "@/events/listeners";

const app = express();
const server = require("http").createServer(app);

// express.js configuration (middlewares etc.)
expressConfig(app);

// server configuration and start
serverConfig(mongoose, server, Environment).startServer();

// DB configuration and connection create
connectDatabase();

app.use(cors());
app.use(HTTP.setupRequest);
// app.use(logger.logRequest);
app.use("/", routeHandler);
app.use(HTTP.processResponse);
app.use(HTTP.handle404);
app.use(logger.logError);
app.use(HTTP.handleError);

// Expose app
export default app;
