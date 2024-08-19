import { Request } from "express";
import { buildQuery as build_query } from "@/utilities/buildQuery";
import Controller from "@/controllers";
import { IDocument } from "@/types/schema";
import { IBuildQueryOptions } from "@/types/general";
import Joi from "joi";

export interface IResult {
  id?: number;
  data?: any;
  acknowledged?: boolean;
  modifiedCount?: number;
  ok?: boolean;
  nModified?: number;
}

interface ErrorResponse {
  error: string;
  payload: null;
  statusCode: number;
  success: false;
}

interface SuccessResponse {
  payload: any;
  error: null;
  statusCode: number;
  success: true;
}

class RootService {
  standardQueryMeta: { isActive: boolean; isDeleted: boolean };
  query_meta: {
    $or: { isActive: boolean }[];
    isDeleted: boolean;
  };

  constructor() {
    this.standardQueryMeta = {
      isActive: true,
      isDeleted: false,
    };

    this.query_meta = {
      $or: [{ isActive: true }, { isActive: false }],
      isDeleted: false,
    };
  }

  get_standard_query_metadata(request: Request) {
    return request?.user?.role?.toLowerCase() === "admin"
      ? this.query_meta
      : this.standardQueryMeta;
  }

  deleteRecordMetadata(record: any) {
    const record_to_mutate = { ...record };
    //
    delete record_to_mutate.timeStamp;
    delete record_to_mutate.createdOn;
    delete record_to_mutate.updatedOn;
    delete record_to_mutate.__v;

    //
    return { ...record_to_mutate };
  }

  async handleDatabaseRead<T extends IDocument>(
    Controller: Controller<T>,
    query_options: IBuildQueryOptions,
    extra_options = {}
  ) {
    const {
      fields_to_return,
      limit,
      seek_conditions,
      skip,
      sort_condition,
      count,
      populate,
    } = build_query(query_options);

    return await Controller.readRecords(
      { ...seek_conditions, ...extra_options },
      fields_to_return,
      sort_condition,
      skip,
      limit,
      count,
      populate
    );
  }

  processSingleRead(result?: IDocument): ErrorResponse | SuccessResponse {
    if (result && result.id) {
      return this.processSuccessfulResponse(result);
    }
    return this.processFailedResponse("Resource not found", 404);
  }

  processMultipleReadResults(
    result?: IResult
  ): ErrorResponse | SuccessResponse {
    if (result && result.data) {
      return this.processSuccessfulResponse(result);
    }
    return this.processFailedResponse("Resource not found", 404);
  }

  processUpdateResult(result: IResult): ErrorResponse | SuccessResponse {
    if (result && result.acknowledged && result.modifiedCount) {
      return this.processSuccessfulResponse(result);
    }
    if (result && result.ok && result.nModified) {
      return this.processSuccessfulResponse(result, 210);
    }
    return this.processFailedResponse("Update failed", 200);
  }

  process_delete_result(result: any): ErrorResponse | SuccessResponse {
    if (result && result.modifiedCount) {
      return this.processSuccessfulResponse(result);
    }
    return this.processFailedResponse("Deletion failed.", 200);
  }

  processFailedResponse(message: any, code: number = 400): ErrorResponse {
    return {
      error: message,
      payload: null,
      statusCode: code,
      success: false,
    };
  }

  processSuccessfulResponse(payload: any, code: number = 200): SuccessResponse {
    return {
      payload,
      error: null,
      statusCode: code,
      success: true,
    };
  }

  processValidationsErrors(error: Joi.ValidationError) {
    if (error) {
      const errorMessages: string[] = error.details.map((detail) =>
        detail.message.replace(/\"/g, "")
      );
      const validationResult = {
        error: "Validation failed", // This might need to be updated
        validationErrors: errorMessages,
        statusCode: 400,
        payload: null,
        success: false,
      };
      return validationResult;
    }
  }
}

export default RootService;
