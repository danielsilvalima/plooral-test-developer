const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

require('dotenv').config({
    override: true,
    path:  '.env',
    //debug: true,
    encoding: 'utf-8'
  });

class DownloaderService{
  async getApiAWS(){
    try{
      const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });
      
      const fileKey = process.env.AWS_FILE_KEY;
      const config = {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        },
      };

      const downloadData = {
        Bucket: process.env.UPLOAD_BUCKET,
        Key: fileKey
      };

      const s3Client = new S3Client(config);
      const response = await s3Client.send(new GetObjectCommand(downloadData));
      
      const retorno = await streamToString(response.Body);
      
      return {code: 200, body: JSON.parse(retorno)};
    } catch (error) {
      return {code: 500, body: {message: "Error internal."}}
    }

  }

}

module.exports = DownloaderService;

