/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import { Models } from "@/models/_config";
import SuperController from "./_super";
import { Model, PopulateOptions, Query } from "mongoose";
import { IDocument } from "@/types/schema";
import { IPopulateOption } from "@/types/general";

class Controller<T extends IDocument> extends SuperController {
  Model: Model<T>;

  constructor(model_name: keyof Models) {
    super();
    this.Model = this.getModel<T>(model_name);
  }

  async createRecord<T>(data: T) {
    try {
      const record_to_create = new this.Model(data);
      const created_record = await record_to_create.save();

      const getId = async () => {
        return await this.getRecordMetadata(
          this.Model,
          created_record._id,
          created_record.timeStamp
        );
      };

      return {
        ...this.jsonize(created_record),
        id: await getId(),
      };
    } catch (e) {
      console.error(e, "create_record");
    }
  }

  async readRecords(
    conditions: any,
    fields_to_return: string = "",
    sort_options: string = "",
    skip: number = 0,
    limit: number = Number.MAX_SAFE_INTEGER,
    count?: boolean,
    populate?: IPopulateOption[]
  ) {
    try {
      const result = {
        data: [] as T[],
        meta: {
          size: 0,
          next_page: skip + 1,
        },
      };

      result.meta.size = await this.Model.countDocuments({ ...conditions });

      if (!count) {
        let query: Query<T[], T, {}> = this.Model.find<T>(
          { ...conditions },
          fields_to_return
        )
          .skip(skip)
          .limit(limit)
          .sort(sort_options || undefined);

        if (populate?.length) {
          populate.forEach((popOption) => {
            query = query.populate(popOption as PopulateOptions) as Query<
              T[],
              T,
              {}
            >;
          });
        }

        result.data = await query.exec();
      }
      return result;
    } catch (e) {
      console.error(e, "readRecords");
    }
  }

  async updateRecords(conditions: any, data_to_set: any) {
    try {
      const result = await this.Model.updateMany<T>(
        {
          ...conditions,
        },
        {
          ...data_to_set,
          $currentDate: { updatedOn: true },
        }
      );

      return this.jsonize(result);
    } catch (e) {
      console.error(e, "updateRecords");
    }
  }

  async deleteRecords(conditions: any) {
    try {
      const result = await this.Model.updateMany<T>(
        {
          ...conditions,
        },
        {
          isActive: false,
          isDeleted: true,
          $currentDate: { updatedOn: true },
        }
      );

      return this.jsonize(result);
    } catch (e) {
      console.error(e, "delete_records");
    }
  }
}

export default Controller;
