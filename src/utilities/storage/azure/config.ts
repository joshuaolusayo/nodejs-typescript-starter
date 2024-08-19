import { BlobServiceClient } from "@azure/storage-blob";
// import { v1 as uuidv1 } from "uuid"
import { DefaultAzureCredential } from "@azure/identity";
import Environment from "@/config/env";

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

class AzureService {
  private accountName = Environment.AZURE_STORAGE_ACCOUNT_NAME;
  private blobServiceClient = new BlobServiceClient(
    `https://${this.accountName}.blob.core.windows.net`,
    new DefaultAzureCredential()
  );

  constructor() {}

  private generateContainerName(baseName: string): string {
    // return `${baseName}-${uuidv1()}`;
    return `${baseName}`;
  }

  async createContainer(containerName: string): Promise<any> {
    containerName = this.generateContainerName(containerName);
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);

    try {
      await containerClient.create();
      return {
        message: "Successfully created container",
        containerName,
      };
    } catch (error: any) {
      console.error("Error creating container:", error.message);
      return {
        message: `Unable to create container: ${error.message}`,
        error,
      };
    }
  }

  async uploadFile(
    file: UploadedFile,
    containerName = Environment.AZURE_STORAGE_DEFAULT_CONTAINER
  ): Promise<any> {
    const fileName =
      Date.now().toString() + file.originalname.replace(/ /g, "-");
    const data = file.buffer;

    if (!data || !fileName) {
      throw new Error("No file or filename provided");
    }

    try {
      const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };
      const containerClient =
        this.blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.upload(data, data.length, options);

      const url = `https://${this.accountName}.blob.core.windows.net/${containerName}/${fileName}`;
      return { url };
    } catch (error: any) {
      console.error("Error uploading file:", error.message);
      return { message: "Unable to upload file", error: error };
    }
  }

  async deleteFile(containerName: string, fileName: string): Promise<any> {
    try {
      const containerClient =
        this.blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      await blockBlobClient.delete();

      return {
        message: "File deleted successfully",
        fileName,
      };
    } catch (error: any) {
      console.error("Error deleting file:", error.message);
      return { message: "Unable to delete file", error: error };
    }
  }

  async retrieveFiles(
    containerName: string
  ): Promise<{ name: string; url: string }[]> {
    const blobs = [];
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);

    for await (const blob of containerClient.listBlobsFlat()) {
      const filename = blob.name;
      const url = `https://${this.accountName}.blob.core.windows.net/${containerName}/${filename}`;
      blobs.push({ name: filename, url });
    }

    return blobs;
  }
}

export default new AzureService();
