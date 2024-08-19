interface IBuildQueryOptions {
  sort_by?: string;
  return_only?: string;
  count?: boolean;
  bool?: false;
  page?: number;
  population?: number;
  include?: string;
  [key: string]: any;
}

interface IBuildQueryOptionsResponse {
  fields_to_return: string;
  limit?: number;
  seek_conditions: ISeekConditions;
  skip?: number;
  sort_condition?: string;
  count?: boolean;
  populate?: IPopulateOption[];
}

interface ISeekConditions {
  [key: string]: any;
}

interface ICustomError extends Error {
  statusCode?: number;
  error?: string;
  validationErrors?: string[];
}

interface INestedPopulateOption {
  path: string;
  select: string;
  populate: INestedPopulateOption[] | null;
}

interface IPopulateOption {
  path: string;
  select?: string;
  populate?: INestedPopulateOption[] | null;
}

interface S3FileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: string | null;
  contentEncoding: string | null;
  storageClass: string;
  serverSideEncryption: string | null;
  metadata: { [key: string]: any };
  location: string;
  etag: string;
  versionId: string | undefined;
}

export {
  IBuildQueryOptions,
  IBuildQueryOptionsResponse,
  ISeekConditions,
  ICustomError,
  IPopulateOption,
  INestedPopulateOption,
  S3FileType,
};
