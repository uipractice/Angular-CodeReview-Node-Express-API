const router = require("express").Router();
const { S3 } = require("@aws-sdk/client-s3");
const multer = require("multer");
const config = require('../config');
const s3 = new S3({
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  },
  maxRetries: 3,
  clientSideMonitoring: false,
});

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 MB limit
  },
});

const S3_BUCKET_NAME = config.S3_BUCKET_NAME;
const S3_BUCKET_KEY = config.S3_BUCKET_KEY;
function generateNewFileName(file) {
  const originalname = file.originalname;
  const fileExtension = originalname.split(".").pop();
  return `${Date.now()}.${fileExtension}`;
}

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  const newFilename = generateNewFileName(req.file); 
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: S3_BUCKET_KEY + newFilename,
    Body: req.file.buffer,
  };

  try {
    const response = await s3.putObject(params);
    res
      .status(200)
      .json({ message: "File uploaded to S3 successfully." + newFilename });
  } catch (err) {
    res.status(500).json({ error: "Error uploading file to S3." });
  }
});


module.exports = router;
