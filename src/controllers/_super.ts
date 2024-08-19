/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { Model } from "mongoose";
import models, { Models } from "../models/_config";

class SuperController {
  getModel<T>(model_name: keyof Models): Model<T> {
    const Model = models[model_name];
    if (!Model) {
      throw new Error(`Model not found: ${model_name}`);
    }
    return Model as unknown as Model<T>;
  }

  jsonize<T>(data: T): T {
    return JSON.parse(JSON.stringify(data)) as T;
  }

  async getRecordMetadata<T>(model: Model<T>, _id: string, timeStamp: Date) {
    const n =
      (await model.countDocuments({ timeStamp: { $lt: timeStamp } })) + 1;
    await model.updateOne({ _id }, { id: n });
    return n;
  }

  async checkIfExists<T extends Document>(
    model_name: keyof Models,
    property: any
  ): Promise<boolean> {
    // const c_model = this.get_model<T>(model_name);
    const check = await this.getModel<T>(model_name).findOne(property);
    return !!check;
  }

  async updateData(
    model_name: keyof Models,
    conditions: any,
    data_to_set: any
  ): Promise<any> {
    try {
      const result = await this.getModel(model_name).updateOne(
        { ...conditions },
        {
          $set: { ...data_to_set },
          $currentDate: { updatedOn: true },
        },
        { upsert: true } // Add the upsert option
      );

      return this.jsonize(result);
    } catch (e) {
      console.log(e);
      return this.processFailedResponse("Unable to update data");
    }
  }

  processFailedResponse(message: string, code: number = 400): ErrorResponse {
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

export default SuperController;
