//Import SDK V3 S3 Client
const {
  S3Client,
  GetObjectCommand, //Download a File
  PutObjectCommand, //Upload a File
  ListObjectsCommand, // List Objects inside a bucket
} = require("@aws-sdk/client-s3");

//Import a buffered file
const fs = require("fs");

//Name of our bucket insid a constant
const BUCKET_NAME = "eswbworkshop";

//IIFE
(async () => {
  //Instantiate a S3 Client
  const S3 = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: "1234",
      secretAccessKey: "4321",
    },
    endpoint: "localhost:13456",
  });

  //Read file and convert it to a buffer
  const fileBuffer = fs.readFileSync("./background_image.jpg");

  //await UploadFile(S3, "background_file", fileBuffer);
  //await DownloadFile(S3, "background_file");
  //await ListFilesInBucket(S3, BUCKET_NAME);
  //await DownloadFile(S3, "yarn.lock");
})();

async function UploadFile(Client, Key, FileBuffer) {
  //Create the upload command
  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: Key, //Which key will refer to this object
    Body: FileBuffer, //The buffer of the file we want to upload
    Metadata: {
      OriginalFileName: "background_image.jpg",
    },
  });

  //Upload file
  try {
    const uploadResponse = await Client.send(uploadCommand);
    console.log(uploadResponse);
  } catch (error) {
    console.error(error);
  }
}

async function DownloadFile(Client, Key) {
  const getObject = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: Key, //The key of the object we want to get
  });

  //Download File
  try {
    const DownloadFile = await Client.send(getObject); // This will execute command

    console.log(DownloadFile);
    //Now we are getting the original filename from the metadata we saved
    const originalFilenameMetadata = DownloadFile.Metadata.originalfilename;

    //We now create a writeStream Buffer with our original filename to save the file
    const outputStream = fs.createWriteStream(
      "./downloads/" + originalFilenameMetadata
    );

    //We redirect the download bytes to our write stream
    DownloadFile.Body.pipe(outputStream); //Redirect downloaded bytes to the filename over time

    outputStream.on("finish", () => {
      console.log(`File ${originalFilenameMetadata} Downloaded with success!`);
    });
  } catch (error) {
    console.error(error);
  }
}

async function ListFilesInBucket(Client, Bucket) {
  //Create the List command
  const ListCommand = new ListObjectsCommand({ Bucket: Bucket });

  //List files
  try {
    const listResponse = await Client.send(ListCommand);

    //Format and show
    // listResponse.Contents.forEach((eachFile) => {
    //   // console.log({
    //   //   key: eachFile.Key,
    //   //   LastModified: eachFile.LastModified,
    //   //   Size: (eachFile.Size / 1024 / 1000).toFixed(2),
    //   //   S3_TIER: eachFile.StorageClass,
    //   // });
    // });
    console.log(listResponse);
  } catch (error) {
    console.error(error);
  }
}
