import multer from "multer";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import { configDotenv } from "dotenv";

configDotenv();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function deleteFileFromS3(key) {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );
    console.log(`Deleted ${key} from S3`);
  } catch (err) {
    console.error("Error deleting from S3:", err);
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

export { upload };
