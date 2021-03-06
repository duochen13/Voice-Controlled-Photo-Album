var aws = require('aws-sdk'); 
require('dotenv').config(); // Configure dotenv to load in the .env file

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
    region: 'us-east-1', // Put your aws region here
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
    signature: 'v4'
})

const S3_BUCKET = process.env.Bucket


exports.sign_s3 = (req,res) => {
    const s3 = new aws.S3();  // Create a new instance of S3
    const fileName = req.body.fileName;
    const fileType = req.body.fileType;
    const Metadata = req.body.Metadata;
    console.log("Metadata: ", Metadata);
  // Set up the payload of what we are sending to the S3 api
    const s3Params = {
      Bucket: 'photo-cc-p2-bucket', //S3_BUCKET,
      Key: fileName,
      Expires: 50,
      ContentType: fileType,
      ACL: 'public-read',
      Metadata: {'customlabels': Metadata}
    };
  // Make a request to the S3 API to get a signed URL which we can use to upload our file
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        res.json({success: false, error: err})
      }
      // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.json({success:true, data:{returnData}});
    });
}