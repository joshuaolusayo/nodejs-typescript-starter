/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import SuperController from "../controllers/_super";
import Environment from "../config/env";
import { IUserModel } from "@/types/schema";

interface JwtUserDetails extends JwtPayload {
  _id: string;
  role: string; // Role property added in JWT payload
}

interface RoleModelPair {
  roles?: string[];
  model: "User" | "Admin";
}

const arrayToLowercase = (arr: string[]) => {
  return arr.map((item) => item.toLowerCase());
};

class AuthMiddleware extends SuperController {
  constructor() {
    super();
  }

  authenticate = (roles: RoleModelPair[]) => {
    return async (
      request: Request,
      _: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { authorization } = request.headers;
        if (!authorization) {
          return next(this.processFailedResponse("Unauthorized", 403));
        }

        const [, api_key] = authorization.split(" ");

        if (!api_key) {
          return next(this.processFailedResponse("Unauthorized", 403));
        }

        let matchingRole: string | null = null;

        for (const role of roles) {
          const Model = this.getModel(role.model);
          if (!Model) {
            // Handle model not found error here
            continue;
          }

          const userDetails = jwt.verify(
            api_key,
            Environment.JWT_SECRET
          ) as JwtUserDetails;

          request.user = (await Model.findById(userDetails._id).select(
            "-password"
          )) as IUserModel;

          if (request.user) {
            // Check if the user's role matches the current role
            const userRole = request.user.role.toLowerCase();
            if (
              !role.roles?.length ||
              arrayToLowercase(role.roles).includes(userRole)
            ) {
              matchingRole = userRole;
              break; // Exit the loop as soon as a match is found
            }
          }
        }

        if (matchingRole) {
          // A matching role was found, allow access to the route
          return next();
        }

        // No matching roles found, return unauthorized
        return next(this.processFailedResponse("Unauthorized", 403));
      } catch (e) {
        const failedResponse = this.processFailedResponse("Unauthorized", 403);
        return next(failedResponse);
      }
    };
  };
}

export { AuthMiddleware };
