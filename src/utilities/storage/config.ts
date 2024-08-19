import Environment from "@/config/env";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3_config = new S3Client({
  region: Environment.AWS_REGION,
  credentials: {
    accessKeyId: Environment.AWS_ACCESS_KEY,
    secretAccessKey: Environment.AWS_SECRET_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    bucket: Environment.AWS_BUCKET_NAME,
    s3: s3_config,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

const storage = multer.memoryStorage();
const upload_file = multer({ storage: storage });

export { upload, s3_config as s3, upload_file };
