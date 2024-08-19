import { S3Client } from "@aws-sdk/client-s3";
import Environment from "./env";
import multer from "multer";
import multerS3 from "multer-s3";

export const s3_config = new S3Client({
  region: Environment.AWS_REGION,
  credentials: {
    accessKeyId: Environment.AWS_ACCESS_KEY,
    secretAccessKey: Environment.AWS_SECRET_KEY,
  },
});

export const upload = multer({
  storage: multerS3({
    bucket: Environment.AWS_BUCKET_NAME,
    s3: s3_config,
    acl: "public-read",
    contentType: function (req, file, cb) {
      const { mimetype } = file;
      cb(null, mimetype);
    },
    metadata: function (req, file, cb) {
      const { originalname, fieldname } = file;
      const file_name = `${originalname.replace(/ /g, "-")}`;
      cb(null, { fieldName: file_name });
    },
    key: function (req, file, cb) {
      const file_name = `${file.originalname.replace(/ /g, "-")}`;
      cb(null, `${Date.now().toString()}${file_name}`);
    },
  }),
});
