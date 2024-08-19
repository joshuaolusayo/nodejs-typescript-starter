import { ICustomError } from "@/types/general";
import { Request, Response, NextFunction } from "express";
import winston, { format } from "winston";

interface LoggerOptions {
  level?: string;
  transports?: winston.transport[];
}

class Logger {
  private logger: winston.Logger;

  constructor(options: LoggerOptions = {}) {
    this.logger = winston.createLogger({
      level: options.level || "info",
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, meta }) => {
          const formattedMessage = `${timestamp} [${level}] - ${message}`;
          if (meta) {
            const metaInfo = JSON.stringify(meta, null, 2);
            return `${formattedMessage}\n${metaInfo}`;
          }
          return formattedMessage;
        })
      ),
      transports: options.transports || [new winston.transports.Console()],
    });
  }

  log(message: string, meta?: any) {
    this.logger.log("info", message, { meta });
  }

  error(message: string, meta?: any) {
    this.logger.log("error", message, { meta });
  }
}

const logger = new Logger();

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  logger.log(`Received ${req.method} request for ${req.url}`, {
    headers: req.headers,
    body: req.body,
  });
  next();
};

const logError = (
  err: ICustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error occurred: ${err.error}`, {
    stack: err.stack,
    status: err.statusCode,
  });
  next(err);
};

export default { logger, logRequest, logError };
