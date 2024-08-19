import { Request, NextFunction } from "express";
import Controller from "@/controllers";
import RootService from "./_root";
import { buildQuery, buildWildcardOptions } from "../utilities/buildQuery";
import { IdSchema } from "@/validations/general";
import { IContactModel } from "@/types/schema";
import { ContactCreationSchema } from "@/validations/contact";

class ContactService extends RootService {
  contactController: Controller<IContactModel>;

  constructor(contactController: Controller<IContactModel>) {
    super();
    this.contactController = contactController;
  }

  async createNew(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const { error } = ContactCreationSchema.validate(body, {
        abortEarly: false,
      });
      if (error) return this.processValidationsErrors(error);

      await this.contactController.createRecord({
        ...body,
      });

      return this.processSuccessfulResponse({
        message:
          "Your message has been received. We will get back to you shortly.",
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async fetchAllMessages(_: Request, next: NextFunction) {
    try {
      const result = await this.contactController.readRecords(
        null,
        "name email message"
      );
      return this.processMultipleReadResults(result);
    } catch (e) {
      next(e);
    }
  }

  async readRecordById(request: Request, next: NextFunction) {
    try {
      const { id } = request.params;
      if (!id) {
        return this.processFailedResponse("Invalid ID supplied.");
      }

      const result = await this.contactController.readRecords({
        _id: id,
        ...this.standardQueryMeta,
      });

      if (result?.data && result.data.length > 0) {
        return this.processSingleRead(result.data[0]);
      } else {
        return this.processFailedResponse("Contact not found", 404);
      }
    } catch (e) {
      console.error(e, "readRecordById");
      return next(e);
    }
  }

  async readRecordsByFilter(request: Request, next: NextFunction) {
    try {
      const { query } = request;
      const result = await this.handleDatabaseRead(
        this.contactController,
        query,
        {
          ...this.standardQueryMeta,
        }
      );
      return this.processMultipleReadResults(result);
    } catch (e) {
      console.error(e, "readRecordsByFilter");
      next(e);
    }
  }

  async readRecordsByFilterBulk(request: Request, next: NextFunction) {
    try {
      const { body } = request;
      const result = await this.handleDatabaseRead(
        this.contactController,
        body,
        {
          ...this.standardQueryMeta,
        }
      );
      return this.processMultipleReadResults(result);
    } catch (e) {
      console.error(e, "readRecordsByFilterBulk");
      next(e);
    }
  }

  async fetchRecordsByWildcard(request: Request, next: NextFunction) {
    try {
      const { params, query } = request;

      if (!params.keys) {
        return this.processFailedResponse("Invalid key/keyword", 400);
      }

      const wildcard_conditions = buildWildcardOptions(
        params.keys,
        query.keyword?.toString() ?? ""
      );
      delete query.keyword;
      const result = await this.handleDatabaseRead(
        this.contactController,
        query,
        {
          ...wildcard_conditions,
          ...this.standardQueryMeta,
        }
      );
      return this.processMultipleReadResults(result);
    } catch (e) {
      console.error(e, "read_records_by_wildcard");
      next(e);
    }
  }

  async updateRecordById(request: Request, next: NextFunction) {
    try {
      const { id } = request.params;
      const data = request.body;

      if (!id) {
        return this.processFailedResponse("Invalid ID supplied.");
      }

      const { error } = IdSchema.validate({ id });
      if (error) return this.processValidationsErrors(error);

      const new_data = this.deleteRecordMetadata(data);
      const result = await this.contactController.updateRecords(
        { _id: id },
        { ...new_data }
      );

      return this.processUpdateResult({ ...result, ...data });
    } catch (e) {
      console.error(e, "update_record_by_id");
      next(e);
    }
  }

  async updateRecords(request: Request, next: NextFunction) {
    try {
      const { options, data } = request.body;
      const { seek_conditions } = buildQuery(options);

      const new_data = this.deleteRecordMetadata(data);
      const result = await this.contactController.updateRecords(
        { ...seek_conditions },
        { ...new_data }
      );
      return this.processUpdateResult({ ...new_data, ...result });
    } catch (e) {
      console.error(e, "update_records");
      next(e);
    }
  }

  async deleteRecordById(request: Request, next: NextFunction) {
    try {
      const { id } = request.params;
      if (!id) {
        return this.processFailedResponse("Invalid ID supplied.");
      }

      const { error } = IdSchema.validate({ id });
      if (error) return this.processValidationsErrors(error);

      const result = await this.contactController.deleteRecords({
        _id: id,
      });

      return this.process_delete_result(result);
    } catch (e) {
      next(e);
    }
  }
}

const ContactControllerInstance = new Controller<IContactModel>("Contact");

export default new ContactService(ContactControllerInstance);
