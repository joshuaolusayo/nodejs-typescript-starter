/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { ICustomError } from "@/types/general";
import { Request, Response, NextFunction } from "express";

export default {
  handle404(request: Request, response: Response, next: NextFunction) {
    // console.log({ request, response });xw
    const return_data = {
      statusCode: 404,
      success: false,
      error: "Resource not found",
      payload: null,
    };

    next(return_data);
  },

  handleError(
    error: ICustomError,
    _: Request,
    response: Response,
    next: NextFunction
  ) {
    // console.log({ error });
    return response.status(error?.statusCode || 500).json({
      success: false,
      statusCode: error?.statusCode || 500,
      error: error?.error || "Internal Server Error",
      payload: null,
      validationErrors: error?.validationErrors,
    });
  },

  processResponse(request: Request, response: Response, next: NextFunction) {
    if (!request.payload) return next();

    const { statusCode } = request.payload;
    return response.status(statusCode).json(request.payload);
  },

  setupRequest(request: Request, response: Response, next: NextFunction) {
    request.headers["access-control-allow-origin"] = "*";
    request.headers["access-control-allow-headers"] = "*";

    if (request.method === "OPTIONS") {
      request.headers["access-control-allow-methods"] =
        "GET, POST, PUT, PATCH, DELETE";
      response.status(200).json();
    }

    next();
  },
};
