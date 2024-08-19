import { Request, NextFunction } from "express";
import RootService from "./_root";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import Environment from "@/config/env";
import { S3FileType } from "@/types/general";
import { s3 } from "@/utilities/storage/config";
import { FilenameSchema } from "@/validations/general";
import Azure, { UploadedFile } from "@/utilities/storage/azure/config";
import { parseAzureStorageUrl } from "@/utilities/general";

class FileService extends RootService {
  constructor() {
    super();
  }

  async upload_single_file(request: Request, next: NextFunction) {
    if (request.file) {
      const file = request.file as unknown as S3FileType;
      return this.processSuccessfulResponse({
        message: "Successfully uploaded file",
        location: file.location,
      });
    }
  }

  // async upload_multiple_file(request: Request, next: NextFunction) {
  //   if (request.files?.length) {
  //     let files = [];
  //     request.files.map((file) => {
  //       const uploaded_file = file as unknown as S3FileType;
  //       files.push({ location: uploaded_file.location });
  //     });
  //     return this.process_successful_response({
  //       message: "Successfully uploaded files",
  //     });
  //   }
  // }

  async get_files(request: Request, next: NextFunction) {
    const population = Number(request.query?.population) || 50;
    const page = Number(request.query?.page) || 1;

    // Calculate the starting point based on the page number
    const startingIndex = (page - 1) * population;

    let continuation_token =
      request.query?.continuation_token?.toString() || undefined;

    try {
      let isTruncated = true;
      let list = [];

      const command = new ListObjectsV2Command({
        Bucket: Environment.AWS_BUCKET_NAME,
        MaxKeys: population, // max is 1000
        ContinuationToken: continuation_token,
      });

      // If starting from a specific index, skip the appropriate number of items
      let skipCount = 0;
      while (skipCount < startingIndex && isTruncated) {
        const { IsTruncated, NextContinuationToken, Contents } = await s3.send(
          command
        );
        Contents && list.push(...Contents);
        continuation_token = NextContinuationToken;
        isTruncated = !!IsTruncated;
        skipCount += Contents?.length || 0;
      }

      while (isTruncated && list.length < population) {
        const { Contents, IsTruncated, NextContinuationToken } = await s3.send(
          command
        );
        Contents && list.push(...Contents);
        continuation_token = NextContinuationToken;
        isTruncated = !!IsTruncated;
      }

      return this.processSuccessfulResponse({
        data: list,
        continuation_token,
        url: Environment.AWS_URL,
      });
    } catch (e) {
      next(e);
    }
  }

  async retrieve_file(request: Request, next: NextFunction) {
    const filename = request.params?.filename;

    const { error } = FilenameSchema.validate({ filename });
    if (error) {
      const errorMessages = error.details.map((detail) =>
        detail.message.replace(/\"/g, "")
      );
      next({
        error: "Validation failed",
        validationErrors: errorMessages,
        statusCode: 400,
      });
    }

    const command = new GetObjectCommand({
      Bucket: Environment.AWS_BUCKET_NAME,
      Key: filename,
    });

    try {
      const response = await s3.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      const str = await response.Body?.transformToString();
      // console.log(str);
      return this.processSuccessfulResponse("Successfully retrieved file");
    } catch (err) {
      console.error(err);
    }
  }

  async delete_file(request: Request, next: NextFunction) {
    const filename = request.params?.filename;

    const { error } = FilenameSchema.validate({ filename });
    if (error) {
      const errorMessages = error.details.map((detail) =>
        detail.message.replace(/\"/g, "")
      );
      next({
        error: "Validation failed",
        validationErrors: errorMessages,
        statusCode: 400,
      });
    }

    const command = new DeleteObjectCommand({
      Bucket: Environment.AWS_BUCKET_NAME,
      Key: filename,
    });

    try {
      const response = await s3.send(command);
      console.log(response);
      return this.processSuccessfulResponse("File deleted successfully");
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  // azure server

  async create_azure_container(request: Request, next: NextFunction) {
    try {
      const {
        body: { title },
      } = request;
      if (!title)
        return this.processFailedResponse("'title' of container not provided");
      const response = await Azure.createContainer(title);

      if (!response.error) {
        return this.processSuccessfulResponse({ message: response.message });
      }
      return this.processFailedResponse({
        message: response.message,
        statusCode: response?.error?.statusCode,
      });
    } catch (error: any) {
      next({
        ...error,
        message: error?.message,
        statusCode: error?.statusCode,
      });
    }
  }

  async upload_files_to_azure(request: Request, next: NextFunction) {
    if (request?.files?.length) {
      const { files } = request;

      const fileArray = files as unknown as UploadedFile[];

      const uploadPromises: Promise<string>[] = [];
      fileArray.forEach((file) => {
        uploadPromises.push(Azure.uploadFile(file));
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      return this.processSuccessfulResponse(uploadedUrls);
    } else {
      return this.processFailedResponse("No files uploaded");
    }
  }

  async delete_file_from_azure(request: Request, next: NextFunction) {
    const { url } = request.body;
    if (!url) return this.processFailedResponse("url not found");
    const parsed_url = parseAzureStorageUrl(url);
    if (!parsed_url) return this.processFailedResponse("Invalid url");
    const { containerName, blobName } = parsed_url;
    try {
      await Azure.deleteFile(containerName, blobName);
      // console.log({ response });
      return this.processSuccessfulResponse({});
    } catch (error: any) {
      console.log(error);
      next({
        ...error,
        message: error?.message,
        statusCode: error?.statusCode,
      });
    }
  }

  async retrieve_files_from_azure(request: Request, next: NextFunction) {
    const container =
      request.query?.container?.toString() ||
      Environment.AZURE_STORAGE_DEFAULT_CONTAINER;

    try {
      const response = await Azure.retrieveFiles(container);
      // console.log({ response });
      return this.processSuccessfulResponse([...response]?.reverse());
    } catch (error: any) {
      console.log(error);
      next({
        ...error,
        message: error?.message,
        statusCode: error?.statusCode,
      });
    }
  }
}

export default new FileService();
